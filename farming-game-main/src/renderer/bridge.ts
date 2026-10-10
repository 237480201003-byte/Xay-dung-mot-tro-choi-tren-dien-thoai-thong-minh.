import { deserialize, serialize } from '../game/save'
import type { GameState } from '../game/types'

/**
 * Exactly what `electron/preload.ts` puts on the window, and exactly what the Capacitor
 * adapter (`src/platform/capacitor-bridge.ts`) installs when running inside an Android
 * WebView. The same four-method shape is what every host agrees on.
 */
export interface SproutBridge {
  readSave(): Promise<string | null>
  writeSave(json: string): Promise<void>
  clearSave(): Promise<void>
}

declare global {
  interface Window {
    sprout?: SproutBridge
    /** The Capacitor runtime, present on Android builds. */
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

/** Where a plain browser (`npm run dev` without Electron) keeps the save. */
const STORAGE_KEY = 'sprout-hollow.save'
const SAVE_KEY_CAPACITOR = 'sprout-hollow.save'

function host(): SproutBridge | null {
  if (typeof window === 'undefined') return null
  return window.sprout ?? null
}

function hasCapacitor(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.Capacitor !== undefined &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform() &&
      typeof window.Preferences === 'object' &&
      window.Preferences !== null
  } catch {
    return false
  }
}

function readLocal(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeLocal(json: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, json)
  } catch {
    // Private mode or a full quota. Losing the save beats crashing the frame loop.
  }
}

function clearLocal(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing stored, or storage is unavailable. Either way there is nothing left to do.
  }
}

async function readCapacitor(): Promise<string | null> {
  const prefs = window.Preferences
  if (prefs === undefined) return null
  try {
    const out = await prefs.get({ key: SAVE_KEY_CAPACITOR })
    return typeof out?.value === 'string' && out.value.length > 0 ? out.value : null
  } catch {
    return null
  }
}

async function writeCapacitor(json: string): Promise<void> {
  const prefs = window.Preferences
  if (prefs === undefined) return
  try {
    await prefs.set({ key: SAVE_KEY_CAPACITOR, value: json })
  } catch {
    // Quota or kernel hiccup. The renderer's own catch is the last line of defence.
  }
}

async function clearCapacitor(): Promise<void> {
  const prefs = window.Preferences
  if (prefs === undefined) return
  try {
    await prefs.remove({ key: SAVE_KEY_CAPACITOR })
  } catch {
    // As above.
  }
}

export async function loadSave(): Promise<GameState | null> {
  const bridge = host()
  let json: string | null = null
  if (bridge) {
    try {
      json = await bridge.readSave()
    } catch {
      json = null
    }
  } else if (hasCapacitor()) {
    json = await readCapacitor()
  } else if (typeof window !== 'undefined') {
    json = readLocal()
  }
  return json === null ? null : deserialize(json)
}

export async function saveGame(state: GameState): Promise<void> {
  const json = serialize(state)
  const bridge = host()
  if (bridge) {
    try {
      await bridge.writeSave(json)
    } catch {
      // The main process already swallows filesystem errors; a rejection here means
      // the channel itself is gone, and there is nowhere better to put the bytes.
    }
    return
  }
  if (hasCapacitor()) {
    await writeCapacitor(json)
    return
  }
  if (typeof window !== 'undefined') writeLocal(json)
}

export async function clearSave(): Promise<void> {
  const bridge = host()
  if (bridge) {
    try {
      await bridge.clearSave()
    } catch {
      // As above: nothing useful the renderer can do about a dead channel.
    }
    return
  }
  if (hasCapacitor()) {
    await clearCapacitor()
    return
  }
  if (typeof window !== 'undefined') clearLocal()
}
