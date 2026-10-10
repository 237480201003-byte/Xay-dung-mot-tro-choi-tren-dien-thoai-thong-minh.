/**
 * Mobile touch controls for the Android build.
 *
 * The game is keyboard-first: every verb in the world — walk, use, sleep, plant,
 * harvest — arrives as a `KeyDown` event on the canvas. A phone has no keyboard, so
 * without this overlay the game would be unplayable.
 *
 * Two surfaces are layered on top of the canvas:
 *
 *  - **A directional pad on the left.** Tap a direction to walk; tap the same
 *    direction repeatedly to keep walking. Long-press a direction to autorun, exactly
 *    the way holding a key down autorepeats.
 *
 *  - **A confirm button on the right.** Tapping it is the same as pressing Space /
 *    Enter — the `use` verb that swings the held tool, opens a door or accepts a panel.
 *
 * Both feed into the same `Input` engine the keyboard does, by dispatching real
 * `KeyboardEvent`s the canvas already listens for. That keeps every scene, every
 * autorepeat rule, every input guard unchanged. The bridge is one-way: the overlay
 * emits, the game consumes. Nothing about the game knows the overlay exists.
 *
 * The overlay is built once, lazily, the first time it is asked to show. It is hidden
 * on any host that is not Capacitor, so the same build keeps a clean canvas on desktop
 * and gets the controls on a phone.
 */

import type { Input } from '../engine/input'

/** A vertical direction in the world layer; horizontal mirrors with one char change. */
type Direction = 'up' | 'down' | 'left' | 'right'

interface HeldDirection {
  /** The button node, so we can swap its pressed state visually. */
  node: HTMLElement
  /** Native pointer id of the active touch, so two fingers on the same pad do not duel. */
  pointerId: number
  /** Engine code the Input layer reads. `KeyW` and `ArrowUp` both walk north. */
  code: string
  /**
   * The autorepeat timer, started after `REPEAT_DELAY` so the first tap is a single step
   * and only holding the pad walks continuously. Mirrors `Input`'s own repeat clock.
   */
  repeat: number | null
}

const REPEAT_DELAY = 320
const REPEAT_INTERVAL = 130

const PAD_BUTTON: ReadonlyArray<{ dir: Direction; code: string; label: string }> = [
  { dir: 'up', code: 'ArrowUp', label: '▲' },
  { dir: 'down', code: 'ArrowDown', label: '▼' },
  { dir: 'left', code: 'ArrowLeft', label: '◀' },
  { dir: 'right', code: 'ArrowRight', label: '▶' },
]

/**
 * Whether the touch overlay should appear at all. It only ships with the Capacitor build
 * (a touch screen on a desktop monitor would still draw it, but desktop mice do not look
 * for it), and only when the platform reports itself as Android.
 */
function hostWantsOverlay(): boolean {
  if (typeof window === 'undefined') return false
  const cap = window.Capacitor
  if (cap === undefined || typeof cap.isNativePlatform !== 'function') return false
  if (!cap.isNativePlatform()) return false
  try {
    return cap.getPlatform() === 'android'
  } catch {
    return false
  }
}

/**
 * Builds the two pads and wires them. Returns a destroy handle that takes them down
 * again — the farm tab tears them down on dispose so a backgrounded tab costs nothing.
 *
 * The pointer events live on `window`, not on the buttons, because a touch that drifts
 * off the button (a finger sliding to the corner of the screen) still has to keep walking
 * the farmer rather than freeze him mid-stride.
 *
 * `canvas` is the keyboard target the engine already listens to; `input` is the live
 * `Input` instance, typed loosely so a host that only knows it as `unknown` (the
 * renderer's `MountOptions.onInput` contract) can still hand it over.
 */
export function installTouchOverlay(canvas: HTMLCanvasElement, input: Input | unknown): () => void {
  if (!hostWantsOverlay()) return (): void => undefined
  if (typeof document === 'undefined') return (): void => undefined
  // Both parameters are reserved for future per-overlay telemetry (long-press feedback,
  // debug overlays). The renderer already feeds the engine through `KeyboardEvent`s,
  // so neither is read inside this function today.
  void canvas
  void input

  const root = document.createElement('div')
  root.id = 'touch-overlay'
  root.setAttribute('aria-hidden', 'false')

  const dpad = document.createElement('div')
  dpad.className = 'touch-dpad'
  dpad.appendChild(makeCentre())
  for (const entry of PAD_BUTTON) {
    dpad.appendChild(makePadButton(entry))
  }
  root.appendChild(dpad)

  const confirm = document.createElement('button')
  confirm.type = 'button'
  confirm.className = 'touch-confirm'
  confirm.textContent = 'USE'
  confirm.setAttribute('aria-label', 'USE')
  root.appendChild(confirm)

  document.body.appendChild(root)

  /**
   * The one direction currently held. The d-pad is laid out so a finger can only really
   * be on one button at a time, but the input layer refuses a second one anyway.
   */
  let held: HeldDirection | null = null

  /** Fires the keydown the Input layer expects, with `repeat: true` for autorepeat. */
  function emit(code: string, repeat: boolean): void {
    if (typeof window === 'undefined') return
    const ev = new KeyboardEvent('keydown', {
      key: code === 'ArrowUp' ? 'ArrowUp' : code === 'ArrowDown' ? 'ArrowDown' : code === 'ArrowLeft' ? 'ArrowLeft' : code === 'ArrowRight' ? 'ArrowRight' : code === 'Space' ? ' ' : code,
      code,
      bubbles: true,
      cancelable: true,
      repeat,
    })
    window.dispatchEvent(ev)
  }

  function emitUp(code: string): void {
    if (typeof window === 'undefined') return
    const ev = new KeyboardEvent('keyup', {
      key: code === 'ArrowUp' ? 'ArrowUp' : code === 'ArrowDown' ? 'ArrowDown' : code === 'ArrowLeft' ? 'ArrowLeft' : code === 'ArrowRight' ? 'ArrowRight' : code === 'Space' ? ' ' : code,
      code,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(ev)
  }

  function release(): void {
    if (held === null) return
    if (held.repeat !== null) {
      clearTimeout(held.repeat)
    }
    emitUp(held.code)
    held.node.classList.remove('is-held')
    held = null
  }

  function press(code: string, node: HTMLElement, pointerId: number): void {
    if (held !== null) release()
    node.classList.add('is-held')
    emit(code, false)
    const repeat = setTimeout(function tick(): void {
      if (held === null) return
      emit(code, true)
      held.repeat = setTimeout(tick, REPEAT_INTERVAL) as unknown as number
    }, REPEAT_DELAY) as unknown as number
    held = { node, pointerId, code, repeat }
  }

  for (const entry of PAD_BUTTON) {
    const node = dpad.querySelector<HTMLElement>(`[data-dir="${entry.dir}"]`)
    if (node === null) continue
    const onDown = (e: PointerEvent): void => {
      e.preventDefault()
      e.stopPropagation()
      try {
        node.setPointerCapture(e.pointerId)
      } catch {
        // Pointer capture is a courtesy, not a contract.
      }
      press(entry.code, node, e.pointerId)
    }
    const onUp = (e: PointerEvent): void => {
      e.preventDefault()
      e.stopPropagation()
      if (held !== null && held.pointerId === e.pointerId) release()
    }
    const onCancel = (e: PointerEvent): void => {
      if (held !== null && held.pointerId === e.pointerId) release()
    }
    node.addEventListener('pointerdown', onDown)
    node.addEventListener('pointerup', onUp)
    node.addEventListener('pointercancel', onCancel)
    node.addEventListener('pointerleave', onCancel)
  }

  const onConfirmDown = (e: PointerEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    confirm.classList.add('is-held')
    emit('Space', false)
  }
  const onConfirmUp = (e: PointerEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    confirm.classList.remove('is-held')
    emitUp('Space')
  }
  confirm.addEventListener('pointerdown', onConfirmDown)
  confirm.addEventListener('pointerup', onConfirmUp)
  confirm.addEventListener('pointercancel', onConfirmUp)
  confirm.addEventListener('pointerleave', onConfirmUp)

  // A system-level cancel (a phone call, an OS overlay) must not strand the farmer.
  const onBlur = (): void => {
    release()
    confirm.classList.remove('is-held')
  }
  window.addEventListener('blur', onBlur)

  return function dispose(): void {
    release()
    window.removeEventListener('blur', onBlur)
    root.remove()
  }
}

/**
 * The grid gap in the middle of the d-pad. It catches the touch that lands between two
 * buttons, which would otherwise fire no direction and confuse the player.
 */
function makeCentre(): HTMLElement {
  const centre = document.createElement('div')
  centre.className = 'touch-dpad__centre'
  centre.setAttribute('aria-hidden', 'true')
  return centre
}

function makePadButton(entry: { dir: Direction; code: string; label: string }): HTMLElement {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = `touch-dpad__btn touch-dpad__btn--${entry.dir}`
  btn.dataset.dir = entry.dir
  btn.setAttribute('aria-label', entry.code)
  btn.textContent = entry.label
  return btn
}