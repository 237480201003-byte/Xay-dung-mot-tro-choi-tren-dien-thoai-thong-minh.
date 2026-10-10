# Sprout Hollow — Android build

A Capacitor shell that wraps the same renderer the desktop build ships. The game
itself is unchanged: 640×448 framebuffer, the same `src/game`, `src/engine`, `src/art`
and `src/renderer` code, the same `localStorage`-fallback save path. The only
additions are four things the phone needs and the desktop does not:

| Concern | Where it lives |
|---|---|
| Save persistence | `@capacitor/preferences`, wrapped by `src/platform/capacitor-bridge.ts` and read through `src/renderer/bridge.ts`. |
| Touch input | `src/platform/touch-overlay.ts` (d-pad + USE button) emitting the same `KeyboardEvent`s the canvas already listens for. |
| Android lifecycle | `MainActivity.java`, status bar painted ink, immersive, no-op on top of Capacitor defaults. |
| Android packaging | `android/` Gradle project, generated through `cap sync android`. |

The desktop build (`npm run dev`, `npm start`, `npm run package`) is untouched.

## Prerequisites

You need everything the desktop build already needs, plus:

- **Node.js 22** (already required).
- **JDK 17.** Android Studio Hedgehog (2023.1) or newer bundles it; if you build
  from the command line, install it and `export JAVA_HOME` to it.
- **Android SDK 34.** Android Studio's SDK Manager installs it.
- **Android Studio Hedgehog (2023.1.1) or newer.** Older releases will refuse the
  `com.android.application` 8.7 plugin.
- **Capacitor 6 CLI.** This is installed by the new `android-app/` workspace, not
  the existing desktop `package.json`.

## One-time setup

From the repository root:

```bash
# 1. Install the desktop toolchain, exactly as the README already says.
npm install

# 2. Install Capacitor and its plugins in the sibling workspace.
cd android-app
npm install
cd ..

# 3. Build the renderer that the WebView will load.
npm run build:renderer
```

## Generate the Android project

```bash
# Add Capacitor to the existing project (only the first time).
npx cap add android

# After every renderer change:
npm run build:renderer
npx cap sync android
```

`npx cap add android` only works once per project. The `android/` folder this
repository already ships is what the tool generates; if you ran `cap add android`
yourself, diff the two and keep ours — it carries the orientation lock, the
status-bar colour, the launcher icon placeholder and the touch-overlay CSS.

## Open in Android Studio

```bash
cd android
# macOS:
open -a AndroidStudio .
# Windows:
start . AndroidStudio.exe
# Linux:
android-studio .
```

Android Studio opens the project, downloads the Gradle 8.10.2 wrapper if needed,
and offers the green Run arrow against any connected device or emulator.

## Build from the command line

```bash
npm run android:build
```

That runs `npm run build:renderer`, `cap sync android`, and `gradlew assembleDebug`.
The APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`.

For a signed release build, configure a signing config in
`android/app/build.gradle` (the file already comments the spot) and run:

```bash
cd android-app
npm run build:aab
```

## How a save gets written

1. The renderer (`src/renderer/bridge.ts`) calls `saveGame(state)`.
2. `saveGame` serialises the state to JSON and asks the bridge for a host. On a
   Capacitor Android build that host is `window.Capacitor.Preferences`, which the
   adapter at `src/platform/capacitor-bridge.ts` exposes with the same
   `readSave`/`writeSave`/`clearSave` shape the Electron preload exposes.
3. The Capacitor plugin writes to the Android `SharedPreferences` for the app's
   package (`uk.dewhui.sprouthollow`). The bytes survive process death, app
   updates, and reboots; only an uninstall or a manual `pm clear` removes them.
4. On the next boot, `loadSave()` reads the same key back through the same
   plugin. The renderer never knew there was a `SharedPreferences` at the bottom of
   the trail.

## How touch input reaches the game

The Capacitor overlay (`src/platform/touch-overlay.ts`) is host-gated: it is only
built when `window.Capacitor.isNativePlatform()` returns true and the platform is
`android`. Every other host — `npm run dev`, the Electron build — gets nothing.

When installed, the overlay sits on top of the canvas with two surfaces:

- **A d-pad at the lower-left.** Each arrow dispatches a `keydown` for
  `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight` (with `Space` from the
  USE button). Holding a direction autorepeats on the same
  `REPEAT_DELAY` / `REPEAT_INTERVAL` clock the desktop input uses.
- **A USE button at the lower-right.** Sends `Space`, which the renderer reads
  as the universal `use` verb.

Both events reach the canvas through `window.dispatchEvent`. The
`src/engine/input.ts` listeners the canvas already has pick them up; nothing in
the game knows a finger is doing the pressing instead of a keyboard.

## How audio works on Android

The WebAudio synthesis (`src/engine/audio.ts`) runs inside Capacitor's WebView
unchanged. The `AudioContext` is created lazily on first input, exactly as it is
in a desktop browser. No native audio bridge is needed; the Chromium WebView
supports the same oscillator and noise APIs the desktop build uses.

## Where to look when something goes wrong

- **APK does not install.** Check `android/app/src/main/AndroidManifest.xml`'s
  `package`/`applicationId` matches the build, and that the Android SDK version
  on the device is ≥ `minSdkVersion` (23, set in `android/variables.gradle`).
- **Save does not persist.** Check `adb logcat | grep Capacitor` for the
  Preferences plugin's output, and confirm `window.Preferences` is reachable in
  the WebView's console.
- **Touch overlay is missing.** `window.Capacitor.getPlatform()` should be
  `"android"`. If it is `"web"` you are running the Web platform rather than
  Android; rebuild with `cap run android` or Android Studio.
- **Canvas is clipped or letterboxed oddly.** The Capacitor WebView inherits the
  desktop build's `getBoundingClientRect()` math (`src/renderer/main.ts`). The
  default pixel scale is `auto`; bump it in the Game settings if you want larger
  pixels at the cost of a smaller farm.

## What this is not

- **Not a rewrite.** The game logic, the renderer, the art and the shell are
  exactly what the desktop build runs. Only the storage backend and the input
  surface change.
- **Not a Play Store release.** The build script emits an unsigned debug APK.
  Before shipping, configure a signing key and run `bundleRelease`.
- **Not a phone-shaped redesign.** A phone is a desktop window with a touch
  surface; we keep the layout, the controls and the keyboard-first contract,
  and add a touch surface in front.