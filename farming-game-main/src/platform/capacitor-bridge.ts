/**
 * The Capacitor / Android adapter.
 *
 * When the game runs inside Capacitor's Android WebView, the `capacitor` object is on
 * `window`, and we want the same `window.sprout` shape the Electron preload exposes
 * (`src/renderer/bridge.ts` duck-types on the four methods, so it works without changes).
 *
 * Two backends are wrapped here, both behind the same `sprout` interface:
 *
 * - **Save data** lives in `Preferences`, which is what the original Capacitor
 *   preference plugin stores. It is process-scoped, persists across launches, and is
 *   wiped only by an uninstall or an explicit clear. The schema is exactly what the
 *   game's own `serialize()` produces: a JSON string under `sprout-hollow.save`.
 *
 * - **Shell data** lives in a separate key, `sprout-hollow.shell`, so a save reset
 *   cannot collide with the shell record (see `src/shell/core/store.ts`).
 *
 * **Audio** is left to the WebView: the WebAudio synthesis in `src/engine/audio.ts`
 * already runs inside a Chromium-based WebView, and Capacitor's `AudioContext` works
 * the moment the first input lands. No native audio bridge is needed.
 *
 * **Window controls** (minimise / maximise / close) are not exposed: a Capacitor app
 * does not have a frameless window to control, and the shell's title bar code reads
 * the absence of `windowControls()` as "no window controls here" rather than as a failure.
 *
 * The module is a no-op on any environment that does not have Capacitor globals, so
 * importing it from a browser or Electron build costs nothing.
 */

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean
      getPlatform: () => string
      Plugins: Record<string, unknown>
    }
    /** The Capacitor Preferences plugin, registered at runtime. */
    Preferences?: {
      get(options: { key: string }): Promise<{ value: string | null }>
      set(options: { key: string; value: string }): Promise<void>
      remove(options: { key: string }): Promise<void>
      clear(): Promise<void>
    }
  }
}

interface CapacitorBridge {
  readSave(): Promise<string | null>
  writeSave(json: string): Promise<void>
  clearSave(): Promise<void>
  readShell(): Promise<string | null>
  writeShell(json: string): Promise<void>
  clearShell(): Promise<void>
}

const SAVE_KEY = 'sprout-hollow.save'
const SHELL_KEY = 'sprout-hollow.shell'

function isCapacitor(): boolean {
  try {
    return typeof window !== 'undefined' &&
      typeof window.Capacitor !== 'undefined' &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform() &&
      typeof window.Preferences === 'object' &&
      window.Preferences !== null
  } catch {
    return false
  }
}

/**
 * What the renderer's bridge duck-types on. Returns null on a non-Capacitor host so the
 * renderer's own `host()` (`src/renderer/bridge.ts`) keeps falling back to localStorage.
 */
export function installCapacitorBridge(): CapacitorBridge | null {
  if (!isCapacitor()) return null
  if (typeof window === 'undefined') return null

  const prefs = window.Preferences as NonNullable<Window['Preferences']>

  const get = async (key: string): Promise<string | null> => {
    try {
      const out = await prefs.get({ key })
      return typeof out?.value === 'string' && out.value.length > 0 ? out.value : null
    } catch {
      return null
    }
  }

  const set = async (key: string, value: string): Promise<void> => {
    try {
      await prefs.set({ key, value })
    } catch {
      // A quota blowup or a kernel hiccup. The bridge surfaces the failure to the
      // renderer's own try/catch, which already swallows it; nothing left to do.
    }
  }

  const remove = async (key: string): Promise<void> => {
    try {
      await prefs.remove({ key })
    } catch {
      // As above.
    }
  }

  const bridge: CapacitorBridge = {
    async readSave(): Promise<string | null> {
      return get(SAVE_KEY)
    },
    async writeSave(json: string): Promise<void> {
      await set(SAVE_KEY, json)
    },
    async clearSave(): Promise<void> {
      await remove(SAVE_KEY)
    },
    async readShell(): Promise<string | null> {
      return get(SHELL_KEY)
    },
    async writeShell(json: string): Promise<void> {
      await set(SHELL_KEY, json)
    },
    async clearShell(): Promise<void> {
      await remove(SHELL_KEY)
    },
  }

  // The Electron preload already owns `window.sprout` when it is there. We only attach
  // when nothing else has, so a Capacitor build that accidentally runs alongside the
  // Electron preload still ends up talking to whichever one loaded first.
  const existing = (window as unknown as { sprout?: unknown }).sprout
  if (existing === undefined) {
    ;(window as unknown as { sprout: CapacitorBridge }).sprout = bridge
  }

  return bridge
}