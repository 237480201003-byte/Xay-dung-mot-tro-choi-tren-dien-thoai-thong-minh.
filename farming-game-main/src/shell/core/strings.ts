/**
 * The string catalogue.
 *
 * Every user-visible string in the shell, plus every message the finished game already
 * produces: English at all five funny levels, and Vietnamese in a single voice (`vi`).
 *
 *   1  plain and factual — the wording you would put in a manual
 *   2  plain, but human
 *   3  warm — the house voice
 *   4  cheeky
 *   5  theatrical, and very funny
 *
 * ABSOLUTE RULE: every level of every key contains exactly the same set of `{parameter}`
 * placeholders. The voice changes; the facts never do. A price, a count, a crop name, a
 * key binding, a file path and an error code read identically at level 1 and at level 5,
 * because they are never written into the string — they are interpolated into it.
 * The Vietnamese line follows the same rule: it carries exactly the same placeholders
 * as the English ones, even where the word order differs.
 * `placeholdersOf()` below is the function the test uses to prove it.
 *
 * No imports, by design: this file must be readable by a plain script.
 */

/** The five English voices, indexed by funny level minus one. */
export type LevelVoices = readonly [string, string, string, string, string]

export interface StringEntry {
  /** English, one voice per funny level (index 0 is level 1). */
  readonly en: LevelVoices
  /** Vietnamese, a single voice. There is no funny level in Vietnamese. */
  readonly vi: string
}

/** `{name}`, `{count}`, `{error_code}`. Nothing else counts as a placeholder. */
const PLACEHOLDER_RE = /\{([A-Za-z0-9_]+)\}/g

/** The placeholder names in `text`, sorted and de-duplicated. Used by the parity test. */
export function placeholdersOf(text: string): string[] {
  const found = new Set<string>()
  for (const match of text.matchAll(PLACEHOLDER_RE)) found.add(match[1])
  return [...found].sort()
}

/**
 * The catalogue proper. `STRINGS` at the foot of the file is this plus the extras and the
 * aliases, so a key defined here can be re-published under a second name for free and the
 * two can never drift apart.
 */
const CORE = {
  // =========================================================================
  // common — shared verbs and nouns for every surface
  // =========================================================================

  'common.ok': {
    en: ['OK', 'OK', 'OK', 'OK', 'OK'],
    vi: 'OK',
  },
  'common.cancel': {
    en: ['Cancel', 'Cancel', 'Never mind', 'Nope, back out', 'Abort the whole affair'],
    vi: 'Thôi',
  },
  'common.close': {
    en: ['Close', 'Close', 'Close it', 'Shut it', 'Draw the curtain'],
    vi: 'Đóng lại',
  },
  'common.save': {
    en: ['Save', 'Save', 'Save it', 'Lock it in', 'Commit it to the ages'],
    vi: 'Lưu lại',
  },
  'common.apply': {
    en: ['Apply', 'Apply', 'Apply it', 'Make it so', 'Let it be written'],
    vi: 'Áp dụng',
  },
  'common.reset': {
    en: ['Reset', 'Reset', 'Put it back', 'Back to how it was', 'Rewind time itself'],
    vi: 'Đặt lại',
  },
  'common.yes': {
    en: ['Yes', 'Yes', 'Yes please', 'Go on then', 'Yes, and hurry'],
    vi: 'Vâng',
  },
  'common.no': {
    en: ['No', 'No', 'No thanks', 'Rather not', 'Absolutely not, thank you'],
    vi: 'Không, cảm ơn',
  },
  'common.search': {
    en: ['Search', 'Search', 'Search', 'Go find it', 'Summon what you seek'],
    vi: 'Tìm kiếm',
  },
  'common.clear': {
    en: ['Clear', 'Clear', 'Clear it', 'Wipe it', 'Erase every trace'],
    vi: 'Xóa đi',
  },
  'common.copy': {
    en: ['Copy', 'Copy', 'Copy it', 'Grab a copy', 'Duplicate it for posterity'],
    vi: 'Sao chép',
  },
  'common.copied': {
    en: ['Copied', 'Copied', 'Copied to the clipboard', 'Got it — it is on your clipboard', 'Copied! It lives in your clipboard now'],
    vi: 'Đã chép vào bộ nhớ tạm',
  },
  'common.none': {
    en: ['None', 'None', 'Nothing here', 'Nothing at all', 'A beautiful, echoing emptiness'],
    vi: 'Chưa có gì',
  },
  'common.loading': {
    en: ['Loading', 'Loading', 'Loading…', 'One moment…', 'Fetching it from the back room…'],
    vi: 'Đang tải…',
  },
  'common.retry': {
    en: ['Retry', 'Try again', 'Try again', 'Give it another go', 'Once more, with feeling'],
    vi: 'Thử lại',
  },
  'common.back': {
    en: ['Back', 'Back', 'Go back', 'Back you go', 'Retreat, gracefully'],
    vi: 'Quay lại',
  },
  'common.more': {
    en: ['{count} more', '{count} more', '{count} more', '{count} more waiting', '{count} more, patiently queueing'],
    vi: 'Còn {count} nữa',
  },
  'common.on': {
    en: ['On', 'On', 'On', 'Switched on', 'Gloriously on'],
    vi: 'Bật',
  },
  'common.off': {
    en: ['Off', 'Off', 'Off', 'Switched off', 'Silent and dark'],
    vi: 'Tắt',
  },
  'common.default': {
    en: ['Default', 'Default', 'The default', 'As it comes', 'Exactly as the maker intended'],
    vi: 'Mặc định',
  },
  'common.custom': {
    en: ['Custom', 'Custom', 'Your own', 'Your own version', 'Your own, and nobody else has it'],
    vi: 'Tùy chỉnh của bạn',
  },
  'common.expand': {
    en: ['Expand', 'Expand', 'Open it up', 'Open it up', 'Unfurl it'],
    vi: 'Mở rộng ra',
  },
  'common.collapse': {
    en: ['Collapse', 'Collapse', 'Fold it away', 'Tuck it away', 'Fold it up and tuck it in'],
    vi: 'Thu gọn lại',
  },
  'common.enabled': {
    en: ['Enabled', 'Enabled', 'Turned on', 'On and working', 'Alive, awake and working'],
    vi: 'Đã bật',
  },
  'common.disabled': {
    en: ['Disabled', 'Disabled', 'Turned off', 'Off for now', 'Fast asleep, for now'],
    vi: 'Đã tắt',
  },
  'common.count': {
    en: ['{count}', '{count}', '{count}', '{count}', '{count}'],
    vi: '{count}',
  },
  'common.error': {
    en: ['Error: {error}', 'Error: {error}', 'Something went wrong: {error}', 'That did not work: {error}', 'Disaster, and it says: {error}'],
    vi: 'Đã xảy ra lỗi: {error}',
  },
  'common.error.code': {
    en: ['Error {code}: {error}', 'Error {code}: {error}', 'Something went wrong — {code}: {error}', 'That failed, code {code}: {error}', 'Catastrophe number {code}, and it reads: {error}'],
    vi: 'Đã xảy ra lỗi — {code}: {error}',
  },
  'common.unsaved': {
    en: ['Unsaved changes', 'Unsaved changes', 'You have unsaved changes', 'There is work here you have not saved', 'Unsaved work, hanging by a thread'],
    vi: 'Bạn có thay đổi chưa lưu',
  },
  'common.dragHandle': {
    en: ['Drag handle', 'Drag handle', 'Grab here to move it', 'Grab here to move it', 'Grab here and drag it wherever you like'],
    vi: 'Nắm vào đây để di chuyển',
  },

  // =========================================================================
  // application chrome — title bar and window controls
  // =========================================================================

  'app.name': {
    en: ['Sprout Hollow', 'Sprout Hollow', 'Sprout Hollow', 'Sprout Hollow', 'Sprout Hollow'],
    vi: 'Sprout Hollow',
  },
  'app.tagline': {
    en: [
      'A farm at the bottom of a wooded valley.',
      'A small farm at the bottom of a wooded valley.',
      'A quiet farm at the bottom of a wooded valley.',
      'One farm, one valley, and nobody rushing you.',
      'A hush of a valley, a rusty hoe, and a whole year to prove yourself.',
    ],
    vi: 'Một trang trại yên bình dưới đáy thung lũng đầy cây.',
  },
  'app.window.label': {
    en: ['Sprout Hollow window', 'Sprout Hollow window', 'The Sprout Hollow window', 'The Sprout Hollow window', 'The Sprout Hollow window itself'],
    vi: 'Cửa sổ Sprout Hollow',
  },
  'titlebar.label': {
    en: ['Title bar', 'Title bar', 'Title bar', 'The title bar', 'The title bar, keeper of the window'],
    vi: 'Thanh tiêu đề',
  },
  'titlebar.dragHint': {
    en: ['Drag to move the window', 'Drag to move the window', 'Drag here to move the window', 'Grab here and the window follows', 'Take hold and the whole window comes with you'],
    vi: 'Kéo vào đây để di chuyển cửa sổ',
  },
  'titlebar.minimise': {
    en: ['Minimise', 'Minimise', 'Minimise', 'Tuck it away', 'Vanish it to the taskbar'],
    vi: 'Thu nhỏ',
  },
  'titlebar.maximise': {
    en: ['Maximise', 'Maximise', 'Fill the screen', 'Take the whole screen', 'Seize the entire screen'],
    vi: 'Toàn màn hình',
  },
  'titlebar.restore': {
    en: ['Restore', 'Restore', 'Back to a window', 'Shrink back to a window', 'Return it to a modest little window'],
    vi: 'Về cửa sổ thường',
  },
  'titlebar.close': {
    en: ['Close', 'Close', 'Close the window', 'Close the window', 'Close the window and end the day'],
    vi: 'Đóng cửa sổ',
  },
  'titlebar.doubleClickHint': {
    en: ['Double-click to maximise', 'Double-click to maximise', 'Double-click to fill the screen', 'Double-click and it takes the screen', 'Double-click and watch it swallow the screen'],
    vi: 'Nhấp đúp để phóng to toàn màn hình',
  },
  'titlebar.documentTitle': {
    en: ['{tab} — {app}', '{tab} — {app}', '{tab} — {app}', '{tab} — {app}', '{tab} — {app}'],
    vi: '{tab} — {app}',
  },

  // =========================================================================
  // tabs
  // =========================================================================

  'tabs.strip.label': {
    en: ['Tabs', 'Tabs', 'Your tabs', 'Your tabs', 'Your tabs, all lined up'],
    vi: 'Các thẻ của bạn',
  },
  'tabs.panel.label': {
    en: ['{title} panel', '{title} panel', 'The {title} panel', 'The {title} panel', 'The {title} panel, in all its glory'],
    vi: 'Bảng {title}',
  },
  'tabs.new': {
    en: ['New tab', 'New tab', 'Open a new tab', 'Open a fresh tab', 'Open a brand new tab, still warm'],
    vi: 'Mở thẻ mới',
  },
  'tabs.close': {
    en: ['Close {title}', 'Close {title}', 'Close {title}', 'Close {title}', 'Close {title} and say goodbye'],
    vi: 'Đóng {title}',
  },
  'tabs.closeOthers': {
    en: ['Close other tabs', 'Close the other tabs', 'Close every other tab', 'Close everything except this one', 'Close everything else and leave this one standing'],
    vi: 'Đóng mọi thẻ khác',
  },
  'tabs.closeRight': {
    en: ['Close tabs to the right', 'Close the tabs to the right', 'Close everything to the right', 'Sweep away everything on the right', 'Sweep the entire right flank into the sea'],
    vi: 'Đóng mọi thẻ bên phải',
  },
  'tabs.closeAll': {
    en: ['Close all tabs', 'Close all the tabs', 'Close every tab', 'Close the lot', 'Close every last one of them'],
    vi: 'Đóng tất cả các thẻ',
  },
  'tabs.pin': {
    en: ['Pin {title}', 'Pin {title}', 'Pin {title} to the front', 'Pin {title} so it stays put', 'Nail {title} to the front so it never wanders'],
    vi: 'Ghim {title} lên đầu',
  },
  'tabs.unpin': {
    en: ['Unpin {title}', 'Unpin {title}', 'Let {title} go free', 'Let {title} roam again', 'Release {title} back into the wild'],
    vi: 'Bỏ ghim {title}',
  },
  'tabs.pinned.badge': {
    en: ['Pinned', 'Pinned', 'Pinned', 'Pinned in place', 'Pinned, and not going anywhere'],
    vi: 'Đã ghim',
  },
  'tabs.duplicate': {
    en: ['Duplicate {title}', 'Duplicate {title}', 'Make a copy of {title}', 'Clone {title}', 'Conjure a second {title} out of thin air'],
    vi: 'Nhân đôi {title}',
  },
  'tabs.rename': {
    en: ['Rename {title}', 'Rename {title}', 'Give {title} a new name', 'Call {title} something else', 'Christen {title} anew'],
    vi: 'Đặt tên mới cho {title}',
  },
  'tabs.moveLeft': {
    en: ['Move {title} left', 'Move {title} left', 'Shift {title} left', 'Nudge {title} to the left', 'Escort {title} one step to the left'],
    vi: 'Dời {title} sang trái',
  },
  'tabs.moveRight': {
    en: ['Move {title} right', 'Move {title} right', 'Shift {title} right', 'Nudge {title} to the right', 'Escort {title} one step to the right'],
    vi: 'Dời {title} sang phải',
  },
  'tabs.reorder.hint': {
    en: [
      'Reorder with {keys}.',
      'Reorder with {keys}.',
      'Drag them, or reorder with {keys}.',
      'Drag them about, or use {keys} if you prefer the keyboard.',
      'Drag them, or press {keys} and watch them shuffle like an obedient chorus line.',
    ],
    vi: 'Kéo thả, hoặc sắp xếp lại bằng {keys}.',
  },
  'tabs.reordered': {
    en: ['{title} moved to position {position}', '{title} moved to position {position}', '{title} is now at position {position}', '{title} has shuffled to position {position}', '{title} has swept grandly into position {position}'],
    vi: '{title} giờ ở vị trí {position}',
  },
  'tabs.overflow': {
    en: ['{count} more tabs', '{count} more tabs', '{count} more tabs over here', '{count} more tabs hiding here', '{count} more tabs, crammed in and waiting'],
    vi: 'Còn {count} thẻ ở đây nữa',
  },
  'tabs.overflow.label': {
    en: ['Tabs that do not fit', 'Tabs that do not fit', 'The tabs that did not fit', 'The tabs that could not squeeze in', 'The poor tabs that could not squeeze in'],
    vi: 'Các thẻ không vừa chỗ',
  },
  'tabs.scrollLeft': {
    en: ['Scroll tabs left', 'Scroll tabs left', 'Scroll the tabs left', 'Slide the tabs left', 'Send the tabs sliding leftward'],
    vi: 'Cuộn các thẻ sang trái',
  },
  'tabs.scrollRight': {
    en: ['Scroll tabs right', 'Scroll tabs right', 'Scroll the tabs right', 'Slide the tabs right', 'Send the tabs sliding rightward'],
    vi: 'Cuộn các thẻ sang phải',
  },
  'tabs.group.new': {
    en: ['New group', 'New group', 'Start a new group', 'Start a new group', 'Found a whole new group'],
    vi: 'Tạo nhóm mới',
  },
  'tabs.group.name.label': {
    en: ['Group name', 'Group name', 'Name of the group', 'What is this group called?', 'What shall we call this noble group?'],
    vi: 'Tên của nhóm',
  },
  'tabs.group.rename': {
    en: ['Rename group {group}', 'Rename group {group}', 'Give group {group} a new name', 'Call group {group} something else', 'Christen group {group} anew'],
    vi: 'Đặt tên mới cho nhóm {group}',
  },
  'tabs.group.collapse': {
    en: ['Collapse group {group}', 'Collapse group {group}', 'Fold group {group} away', 'Tuck group {group} away', 'Fold group {group} up neatly and tuck it in'],
    vi: 'Thu gọn nhóm {group}',
  },
  'tabs.group.expand': {
    en: ['Expand group {group}', 'Expand group {group}', 'Open group {group} up', 'Open group {group} back up', 'Unfurl group {group} in all its glory'],
    vi: 'Mở nhóm {group}',
  },
  'tabs.group.addTo': {
    en: ['Add {title} to group {group}', 'Add {title} to group {group}', 'Put {title} into group {group}', 'Pop {title} into group {group}', 'Usher {title} into the ranks of group {group}'],
    vi: 'Cho {title} vào nhóm {group}',
  },
  'tabs.group.remove': {
    en: ['Remove {title} from group {group}', 'Remove {title} from group {group}', 'Take {title} out of group {group}', 'Pull {title} out of group {group}', 'Extract {title} from group {group}, gently'],
    vi: 'Đưa {title} ra khỏi nhóm {group}',
  },
  'tabs.group.count': {
    en: ['{group}: {count} tabs', '{group}: {count} tabs', '{group} holds {count} tabs', '{group} is looking after {count} tabs', '{group} presides over {count} loyal tabs'],
    vi: '{group} có {count} thẻ',
  },
  'tabs.group.label': {
    en: ['Tab group {group}', 'Tab group {group}', 'Tab group {group}', 'The {group} group', 'The noble tab group {group}'],
    vi: 'Nhóm thẻ {group}',
  },
  'tabs.unsaved.title': {
    en: ['Close {title}?', 'Close {title}?', 'Close {title} anyway?', 'Really close {title}?', 'Truly, madly, close {title}?'],
    vi: 'Vẫn đóng {title}?',
  },
  'tabs.unsaved.body': {
    en: [
      '{title} has unsaved work. Closing it discards the changes.',
      '{title} has unsaved work. Closing it discards the changes.',
      '{title} has work you have not saved. Close it and the changes go.',
      '{title} has unsaved work, and closing it throws that work away.',
      '{title} is clutching unsaved work. Close it and that work is gone forever, unmourned.',
    ],
    vi: '{title} có thay đổi bạn chưa lưu. Đóng thẻ là mất hết.',
  },
  'tabs.unsaved.discard': {
    en: ['Close without saving', 'Close without saving', 'Close and lose the changes', 'Close it, changes and all', 'Close it and let the changes perish'],
    vi: 'Đóng và bỏ thay đổi',
  },
  'tabs.unsaved.keep': {
    en: ['Keep it open', 'Keep it open', 'Leave it open', 'Leave it be', 'Leave it open and breathing'],
    vi: 'Cứ để mở',
  },
  'tabs.closed': {
    en: ['Closed {title}', 'Closed {title}', 'Closed {title}', '{title} is gone', '{title} has left the building'],
    vi: 'Đã đóng {title}',
  },
  'tabs.reopen': {
    en: ['Reopen {title}', 'Reopen {title}', 'Bring {title} back', 'Bring {title} back', 'Resurrect {title} from the void'],
    vi: 'Mở lại {title}',
  },
  'tabs.empty': {
    en: ['No tabs are open.', 'No tabs are open.', 'Nothing is open right now.', 'Not a single tab open.', 'Not one tab open. The silence is deafening.'],
    vi: 'Hiện không có thẻ nào đang mở.',
  },

  // =========================================================================
  // tab searches and bulk close
  // =========================================================================

  'search.tabs.strip.label': {
    en: ['Search this tab strip', 'Search this tab strip', 'Search the tabs on this strip', 'Hunt through the tabs on this strip', 'Interrogate every tab on this strip'],
    vi: 'Tìm trong các thẻ trên thanh này',
  },
  'search.tabs.strip.placeholder': {
    en: ['Search tabs', 'Search tabs', 'Search tabs', 'Which tab are you after?', 'Name the tab and it shall appear'],
    vi: 'Tìm thẻ',
  },
  'search.tabs.group.label': {
    en: ['Search tabs in group {group}', 'Search tabs in group {group}', 'Search the tabs inside group {group}', 'Hunt through group {group}', 'Interrogate every tab inside group {group}'],
    vi: 'Tìm các thẻ trong nhóm {group}',
  },
  'search.tabs.group.placeholder': {
    en: ['Search in {group}', 'Search in {group}', 'Search inside {group}', 'What are you after in {group}?', 'Name it and {group} will hand it over'],
    vi: 'Tìm trong {group}',
  },
  'search.tabs.groupNames.label': {
    en: ['Search group names', 'Search group names', 'Search the names of the groups', 'Hunt through the group names', 'Interrogate the group names themselves'],
    vi: 'Tìm theo tên nhóm',
  },
  'search.tabs.groupNames.placeholder': {
    en: ['Search groups', 'Search groups', 'Search groups', 'Which group?', 'Which group, out of all of them?'],
    vi: 'Tìm nhóm',
  },
  'search.tabs.all.label': {
    en: ['Search all tabs', 'Search all open tabs', 'Search every tab in the app', 'Hunt through every tab in the app', 'Interrogate every last tab this app owns'],
    vi: 'Tìm mọi thẻ trong ứng dụng',
  },
  'search.tabs.all.placeholder': {
    en: ['Search all tabs', 'Search all tabs', 'Search everywhere', 'Search absolutely everywhere', 'Search every corner of every tab'],
    vi: 'Tìm khắp nơi',
  },
  'tabs.close.matching': {
    en: ['Close tabs containing text', 'Close tabs containing text', 'Close every tab that matches', 'Close every tab that matches', 'Close every tab that dares to match'],
    vi: 'Đóng mọi thẻ khớp',
  },
  'tabs.close.notMatching': {
    en: ['Close tabs not containing text', 'Close tabs not containing text', 'Close every tab that does not match', 'Close everything that does not match', 'Spare the matches and close all the rest'],
    vi: 'Đóng mọi thẻ không khớp',
  },
  'tabs.close.preview': {
    en: [
      'This will close {count} of {total} tabs.',
      'This will close {count} of {total} tabs.',
      'That would close {count} of your {total} tabs.',
      'Careful — that closes {count} of your {total} tabs.',
      'Brace yourself: {count} of your {total} tabs are for the chop.',
    ],
    vi: 'Thao tác này sẽ đóng {count} trên tổng số {total} thẻ của bạn.',
  },
  'tabs.close.none': {
    en: ['Nothing matches, so nothing will close.', 'Nothing matches, so nothing will close.', 'Nothing matches — no tabs would close.', 'Nothing matches, so everybody survives.', 'Nothing matches. Every tab lives to see another day.'],
    vi: 'Không có gì khớp — sẽ không có thẻ nào bị đóng.',
  },
  'tabs.close.all': {
    en: [
      'That matches every tab. Refine the query or close them deliberately.',
      'That matches every tab. Refine the query or close them deliberately.',
      'That matches every single tab — narrow it down, or close them on purpose.',
      'That matches everything. Narrow it down unless you truly meant all of them.',
      'That matches every tab you own. Narrow it down, unless total annihilation was the plan.',
    ],
    vi: 'Khớp với tất cả các thẻ — hãy thu hẹp lại, hoặc đóng hết một cách có chủ ý.',
  },
  'tabs.close.emptyQuery': {
    en: ['Type something first.', 'Type something first.', 'Type something to match on first.', 'Give it something to match on first.', 'Give it something to work with — it cannot read minds.'],
    vi: 'Hãy nhập gì đó để so khớp trước.',
  },
  'tabs.close.invalid': {
    en: ['The query is not valid: {error}', 'The query is not valid: {error}', 'That query does not work: {error}', 'That query is broken: {error}', 'That query is a shambles: {error}'],
    vi: 'Truy vấn này không dùng được: {error}',
  },
  'tabs.close.pinnedExcluded': {
    en: ['Pinned tabs are left alone.', 'Pinned tabs are left alone.', 'Pinned tabs stay where they are.', 'Pinned tabs are safe from this.', 'Pinned tabs are untouchable. They have earned it.'],
    vi: 'Các thẻ đã ghim vẫn giữ nguyên.',
  },
  'tabs.close.includePinned': {
    en: ['Include pinned tabs', 'Include pinned tabs', 'Include the pinned tabs too', 'Take the pinned ones as well', 'Take the pinned ones too, no mercy'],
    vi: 'Tính cả các thẻ đã ghim',
  },
  'tabs.close.confirm.title': {
    en: ['Close {count} tabs?', 'Close {count} tabs?', 'Close {count} tabs?', 'Really close {count} tabs?', 'Really send {count} tabs to their doom?'],
    vi: 'Đóng {count} thẻ?',
  },
  'tabs.close.confirm.body': {
    en: [
      '{count} tabs will close. {unsaved} of them have unsaved work.',
      '{count} tabs will close. {unsaved} of them have unsaved work.',
      '{count} tabs are about to close, and {unsaved} of them have work you have not saved.',
      '{count} tabs are for the chop, and {unsaved} of them are still holding unsaved work.',
      '{count} tabs go over the edge, and {unsaved} of them are still clutching unsaved work.',
    ],
    vi: 'Sắp đóng {count} thẻ, và {unsaved} thẻ trong số đó có thay đổi chưa lưu.',
  },
  'tabs.close.done': {
    en: ['Closed {count} tabs.', 'Closed {count} tabs.', 'Closed {count} tabs.', '{count} tabs, gone.', '{count} tabs, swept clean away.'],
    vi: 'Đã đóng {count} thẻ.',
  },

  // =========================================================================
  // settings — the tab, its sections, and every row
  // =========================================================================

  'settings.title': {
    en: ['Settings', 'Settings', 'Settings', 'Settings', 'Settings, where you bend the app to your will'],
    vi: 'Cài đặt',
  },
  'settings.desc': {
    en: [
      'Everything here is saved on this computer.',
      'Everything here is saved on this computer.',
      'Everything here stays on this computer.',
      'Everything here stays on this computer — nothing is sent anywhere.',
      'Everything here stays on this computer. Nothing is sent anywhere, to anyone, ever.',
    ],
    vi: 'Mọi thứ ở đây chỉ nằm trên máy tính này.',
  },
  'search.settings.label': {
    en: ['Search settings', 'Search settings', 'Search every setting', 'Hunt through every setting', 'Interrogate every setting in the place'],
    vi: 'Tìm mọi cài đặt',
  },
  'search.settings.placeholder': {
    en: ['Search settings', 'Search settings', 'What are you looking for?', 'What are you after?', 'Name it and it shall be found'],
    vi: 'Bạn đang tìm gì?',
  },
  'settings.search.count': {
    en: ['{count} settings match.', '{count} settings match.', '{count} settings match.', '{count} settings turned up.', '{count} settings answered the call.'],
    vi: 'Có {count} cài đặt khớp.',
  },
  'settings.search.empty': {
    en: ['No setting matches {query}.', 'No setting matches {query}.', 'Nothing matches {query}.', 'Nothing here matches {query}.', 'Not one setting answers to {query}.'],
    vi: 'Không có gì khớp với {query}.',
  },
  'settings.section.language': {
    en: ['Language', 'Language', 'Language', 'Language', 'Language, and how funny it gets'],
    vi: 'Ngôn ngữ',
  },
  'settings.section.language.desc': {
    en: [
      'Choose the language and how the app speaks.',
      'Choose the language and how the app speaks to you.',
      'Pick the language, and pick how much personality it has.',
      'Pick the language, then decide how much cheek it is allowed.',
      'Pick the language, then decide how theatrical it is allowed to be.',
    ],
    vi: 'Chọn ngôn ngữ, và chọn độ cá tính của nó.',
  },
  'settings.section.appearance': {
    en: ['Appearance', 'Appearance', 'Appearance', 'Appearance', 'Appearance, down to the last pixel'],
    vi: 'Giao diện',
  },
  'settings.section.appearance.desc': {
    en: [
      'Colours, sizes and spacing for the shell.',
      'Colours, sizes and spacing for the shell around the game.',
      'Colours, sizes and spacing — every part of the shell can be changed.',
      'Colours, sizes and spacing. Every last part of the shell will do as it is told.',
      'Colours, sizes and spacing. Every pixel of the shell is yours to boss about.',
    ],
    vi: 'Màu sắc, kích cỡ và khoảng cách — mọi phần của giao diện đều chỉnh được.',
  },
  'settings.section.motion': {
    en: ['Motion and accessibility', 'Motion and accessibility', 'Motion and accessibility', 'Motion and accessibility', 'Motion and accessibility, taken seriously'],
    vi: 'Chuyển động và hỗ trợ tiếp cận',
  },
  'settings.section.motion.desc': {
    en: [
      'Animation, focus and screen reader behaviour.',
      'Animation, focus and screen reader behaviour.',
      'How much things move, and how the app talks to a screen reader.',
      'How much things move, and how politely the app talks to a screen reader.',
      'How much things move, and how the app behaves for the people who need it to behave.',
    ],
    vi: 'Mọi thứ chuyển động nhiều hay ít, và cách ứng dụng trò chuyện với trình đọc màn hình.',
  },
  'settings.section.scale': {
    en: ['Display scale', 'Display scale', 'Display scale', 'Display scale', 'Display scale, for eyes of every kind'],
    vi: 'Tỉ lệ hiển thị',
  },
  'settings.section.scale.desc': {
    en: [
      'How large the shell is drawn.',
      'How large the shell is drawn.',
      'How large everything outside the game is drawn.',
      'How large everything outside the game is drawn. Nothing will clip.',
      'How large everything outside the game is drawn. Nothing clips, nothing overlaps, nothing escapes.',
    ],
    vi: 'Mọi thứ bên ngoài trò chơi được vẽ lớn đến đâu.',
  },
  'settings.section.audio': {
    en: ['Audio', 'Audio', 'Audio', 'Audio', 'Audio, synthesised on the spot'],
    vi: 'Âm thanh',
  },
  'settings.section.audio.desc': {
    en: [
      'Every sound is generated at runtime. No audio files.',
      'Every sound is generated at runtime. There are no audio files.',
      'Every sound is made up on the spot — there is not one audio file in here.',
      'Every sound is made up on the spot. Not one audio file, not one download.',
      'Every sound is conjured out of arithmetic on the spot. Not one audio file anywhere.',
    ],
    vi: 'Mọi âm thanh đều được tạo ra ngay tại chỗ — ở đây không có lấy một tệp âm thanh nào.',
  },
  'settings.section.game': {
    en: ['Game', 'Game', 'Game', 'Game', 'The farm itself'],
    vi: 'Trò chơi',
  },
  'settings.section.game.desc': {
    en: [
      'The farm, its save and its seed.',
      'The farm, its save and its seed.',
      'The farm itself — the save and the seed it grew from.',
      'The farm itself: the save, and the seed the whole valley grew from.',
      'The farm itself: one save, and the single number the whole valley grew out of.',
    ],
    vi: 'Chính trang trại — bản lưu và hạt giống mà nó mọc lên từ đó.',
  },
  'settings.section.data': {
    en: ['Data', 'Data', 'Data', 'Data', 'Data, and how to take it with you'],
    vi: 'Dữ liệu',
  },
  'settings.section.data.desc': {
    en: [
      'Export, import and reset. Everything stays on this computer.',
      'Export, import and reset. Everything stays on this computer.',
      'Export it, import it, or wipe it. It never leaves this computer.',
      'Export it, import it, or wipe the lot. It never leaves this computer.',
      'Export it, import it, or wipe the lot. Not one byte ever leaves this computer.',
    ],
    vi: 'Xuất ra, nhập vào, hoặc xóa sạch. Nó không bao giờ rời khỏi máy tính này.',
  },
  'settings.section.about': {
    en: ['About', 'About', 'About', 'About', 'About, credits and confessions'],
    vi: 'Giới thiệu',
  },
  'settings.section.about.desc': {
    en: [
      'Version, licence and credits.',
      'Version, licence and credits.',
      'Version, licence and who to thank.',
      'Version, licence, and who to thank for all this.',
      'Version, licence, and the list of people to thank for the whole valley.',
    ],
    vi: 'Phiên bản, giấy phép và những người cần cảm ơn.',
  },

  // ---- language rows ------------------------------------------------------

  'settings.lang.mode.label': {
    en: ['Language', 'Language', 'Language', 'Which language?', 'Which tongue shall we speak?'],
    vi: 'Ngôn ngữ',
  },
  'settings.lang.mode.desc': {
    en: [
      'English, Vietnamese, or both at once.',
      'English, Vietnamese, or both at once.',
      'English, Vietnamese, or both side by side.',
      'English, Vietnamese, or both side by side if you cannot choose.',
      'English, Vietnamese, or both at once for the greedy and the bilingual.',
    ],
    vi: 'Tiếng Anh, tiếng Việt, hoặc cả hai song song.',
  },
  'settings.lang.option.en': {
    en: ['English', 'English', 'English', 'English', 'English'],
    vi: 'Tiếng Anh',
  },
  'settings.lang.option.en.desc': {
    en: ['English only.', 'English only.', 'English only.', 'English, and nothing but.', 'English, and not a character more.'],
    vi: 'Chỉ tiếng Anh.',
  },
  'settings.lang.option.vi': {
    en: ['Vietnamese', 'Vietnamese', 'Vietnamese', 'Vietnamese', 'Vietnamese'],
    vi: 'Tiếng Việt',
  },
  'settings.lang.option.vi.desc': {
    en: [
      'Vietnamese. Strings not translated yet show in English.',
      'Vietnamese. Strings not translated yet show in English.',
      'Vietnamese. Anything not translated yet shows in English.',
      'Vietnamese, with English standing in for whatever is not translated yet.',
      'Vietnamese, with English stepping in politely wherever a translation is still missing.',
    ],
    vi: 'Tiếng Việt. Chỗ nào chưa dịch sẽ hiện bằng tiếng Anh.',
  },
  'settings.lang.option.both': {
    en: ['Both', 'Both', 'Both at once', 'Both at once', 'Both at once, shoulder to shoulder'],
    vi: 'Cả hai cùng lúc',
  },
  'settings.lang.option.both.desc': {
    en: [
      'English and Vietnamese together, separated by {separator}.',
      'English and Vietnamese together, separated by {separator}.',
      'English and Vietnamese side by side, with {separator} between them.',
      'English and Vietnamese side by side, joined by a tidy {separator}.',
      'English and Vietnamese arm in arm, with a dignified {separator} holding them together.',
    ],
    vi: 'Tiếng Anh và tiếng Việt song song, ngăn cách bằng {separator}.',
  },
  'settings.lang.funny.en.label': {
    en: ['English funny level', 'English funny level', 'How funny the English is', 'How funny the English is allowed to be', 'How theatrical the English is allowed to get'],
    vi: 'Tiếng Anh hài hước đến mức nào',
  },
  'settings.lang.funny.en.desc': {
    en: [
      'Level {level} of {max}: {name}.',
      'Level {level} of {max}: {name}.',
      'Currently level {level} of {max} — {name}.',
      'Sitting at level {level} of {max}, which is {name}.',
      'Currently level {level} of {max}, otherwise known as {name}.',
    ],
    vi: 'Hiện là cấp {level} trên {max} — {name}.',
  },
  'settings.lang.funny.level.1': {
    en: ['Plain', 'Plain', 'Plain', 'Plain', 'Plain'],
    vi: 'Thẳng thắn',
  },
  'settings.lang.funny.level.1.desc': {
    en: [
      'Facts only. The wording you would put in a manual.',
      'Facts only. The wording you would put in a manual.',
      'Just the facts, the way a manual would put it.',
      'Just the facts. No jokes, no flourishes, no nonsense.',
      'Just the facts. Not one joke shall pass these lips.',
    ],
    vi: 'Chỉ có sự thật, như cách một cuốn hướng dẫn sẽ nói.',
  },
  'settings.lang.funny.level.2': {
    en: ['Clear', 'Clear', 'Clear', 'Clear', 'Clear'],
    vi: 'Rõ ràng',
  },
  'settings.lang.funny.level.2.desc': {
    en: [
      'Plain, but written by a person.',
      'Plain, but written by a person.',
      'Still plain, but it sounds like a person wrote it.',
      'Still plain, but at least a human being wrote it.',
      'Still plain, but a living human being clearly held the pen.',
    ],
    vi: 'Vẫn đơn giản, nhưng nghe như do một con người viết.',
  },
  'settings.lang.funny.level.3': {
    en: ['Warm', 'Warm', 'Warm', 'Warm', 'Warm'],
    vi: 'Ấm áp',
  },
  'settings.lang.funny.level.3.desc': {
    en: [
      'The house voice. Friendly, not silly.',
      'The house voice. Friendly, not silly.',
      'The house voice — friendly, and never silly.',
      'The house voice: friendly, warm, and never gone daft.',
      'The house voice: warm as a lantern, and never once daft.',
    ],
    vi: 'Giọng của nhà — thân thiện, và không bao giờ lố.',
  },
  'settings.lang.funny.level.4': {
    en: ['Cheeky', 'Cheeky', 'Cheeky', 'Cheeky', 'Cheeky'],
    vi: 'Tinh nghịch',
  },
  'settings.lang.funny.level.4.desc': {
    en: [
      'Jokes allowed. Facts still untouched.',
      'Jokes allowed. The facts stay untouched.',
      'Jokes allowed, and the facts stay exactly where they were.',
      'Jokes allowed, teasing allowed, and the facts stay exactly where they were.',
      'Jokes, teasing and mild insolence allowed. The facts remain untouched throughout.',
    ],
    vi: 'Được phép đùa, còn sự thật thì vẫn y nguyên chỗ cũ.',
  },
  'settings.lang.funny.level.5': {
    en: ['Theatrical', 'Theatrical', 'Theatrical', 'Theatrical', 'Theatrical'],
    vi: 'Sân khấu',
  },
  'settings.lang.funny.level.5.desc': {
    en: [
      'Full performance. Facts still untouched.',
      'Full performance. The facts stay untouched.',
      'A full performance every time, with the facts still perfectly intact.',
      'Curtains up, orchestra in, and the facts still perfectly intact.',
      'Curtains up, orchestra in, the farmer weeping in the wings — and every fact still perfectly intact.',
    ],
    vi: 'Lần nào cũng là một màn biểu diễn trọn vẹn, mà sự thật vẫn nguyên vẹn.',
  },
  'settings.lang.disclosure': {
    en: [
      'The funny level changes the wording of every message, including warnings and failures. It never changes a fact: a number, a name, a file path, a key binding, an error code and a crop price read the same at level {min} and at level {max}.',
      'The funny level changes the wording of every message, including warnings and failures. It never changes a fact: a number, a name, a file path, a key binding, an error code and a crop price read the same at level {min} and at level {max}.',
      'The funny level restyles every message you will ever see, warnings and failures included. What it will never do is touch a fact — a number, a name, a file path, a key binding, an error code and a crop price read exactly the same at level {min} and at level {max}.',
      'The funny level restyles every message in the app, warnings and failures included, so do not expect a quiet life at the top. What it will never do is touch a fact: a number, a name, a file path, a key binding, an error code and a crop price read exactly the same at level {min} and at level {max}.',
      'The funny level restyles every message this app will ever say to you — warnings, failures, disasters and all. But it is under strict orders and it never touches a fact: a number, a name, a file path, a key binding, an error code and a crop price read exactly, identically, immovably the same at level {min} and at level {max}.',
    ],
    vi: 'Mức hài hước làm mới phong cách của mọi thông báo bạn sẽ thấy, kể cả cảnh báo và lỗi. Nhưng nó sẽ không bao giờ đụng đến sự thật — một con số, một cái tên, một đường dẫn tệp, một phím tắt, một mã lỗi hay giá nông sản đều đọc y hệt nhau ở cấp {min} và cấp {max}.',
  },
  'settings.lang.disclosure.example': {
    en: [
      'For example, {crop} sells for {price}g at every level.',
      'For example, {crop} sells for {price}g at every level.',
      'For example: {crop} sells for {price}g, at every single level.',
      'For example: {crop} sells for {price}g at level one and {price}g at level five. Funny that.',
      'For example: {crop} sells for {price}g at level one and — hold your breath — {price}g at level five.',
    ],
    vi: 'Ví dụ: {crop} bán được {price}g, ở mọi cấp độ.',
  },
  'settings.lang.preview.label': {
    en: ['Preview', 'Preview', 'Have a listen', 'Have a listen to it', 'A small sample, for your consideration'],
    vi: 'Nghe thử',
  },
  'settings.lang.changed': {
    en: ['Language set to {lang}.', 'Language set to {lang}.', 'Now speaking {lang}.', 'Right then — {lang} it is.', 'From this moment on, we speak {lang}.'],
    vi: 'Đã chuyển sang {lang}.',
  },
  'settings.lang.funny.changed': {
    en: ['Funny level set to {level}, {name}.', 'Funny level set to {level}, {name}.', 'Funny level is now {level} — {name}.', 'Funny level cranked to {level}, otherwise known as {name}.', 'Funny level hauled up to {level}, otherwise known as {name}. Consequences follow.'],
    vi: 'Mức hài hước giờ là cấp {level} — {name}.',
  },

  // ---- motion, scale, audio, game, data, about ----------------------------

  'settings.motion.label': {
    en: ['Motion', 'Motion', 'How much things move', 'How much things move', 'How much this place is allowed to move'],
    vi: 'Mức độ chuyển động',
  },
  'settings.motion.desc': {
    en: [
      'This setting overrides the system preference in either direction.',
      'This setting overrides the system preference in either direction.',
      'This overrides what your system asks for, in either direction.',
      'This overrules your system preference, in either direction — you have the final say.',
      'This overrules your system preference in either direction. You are the final authority here.',
    ],
    vi: 'Cài đặt này ghi đè yêu cầu của hệ thống, theo cả hai chiều.',
  },
  'settings.motion.option.system': {
    en: ['Follow the system', 'Follow the system', 'Follow the system', 'Do whatever the system says', 'Obey the system, quietly'],
    vi: 'Theo hệ thống',
  },
  'settings.motion.option.full': {
    en: ['Full motion', 'Full motion', 'Full motion', 'Everything moves', 'Everything sways, drifts and sparkles'],
    vi: 'Chuyển động đầy đủ',
  },
  'settings.motion.option.reduced': {
    en: ['Reduced motion', 'Reduced motion', 'Calm it down', 'Calm the whole thing down', 'Still the valley — tweens stay, sparkle goes'],
    vi: 'Giảm bớt đi',
  },
  'settings.motion.reduced.note': {
    en: [
      'Particles, shake and sway stop. Movement between tiles stays.',
      'Particles, shake and sway stop. Movement between tiles stays.',
      'Particles, shake and sway all stop; the farmer still walks between tiles properly.',
      'Particles, shake and sway are shown the door; the farmer still walks like a person.',
      'Particles, shake and sway are shown the door. The farmer still walks like a person, thank goodness.',
    ],
    vi: 'Hạt bụi, rung lắc và đung đưa đều dừng hẳn; người nông dân vẫn bước đi giữa các ô như thường.',
  },
  'settings.motion.announce.label': {
    en: ['Announce changes to screen readers', 'Announce changes to screen readers', 'Announce what changes to a screen reader', 'Tell a screen reader what just happened', 'Narrate every change aloud for a screen reader'],
    vi: 'Thông báo thay đổi cho trình đọc màn hình',
  },
  'settings.motion.announce.desc': {
    en: [
      'State changes are mirrored into a live region.',
      'State changes are mirrored into a live region.',
      'Anything that changes is mirrored into a live region for a screen reader.',
      'Anything that changes gets mirrored into a live region, so nothing happens in silence.',
      'Every change is mirrored into a live region, so nothing whatsoever happens in silence.',
    ],
    vi: 'Mọi thay đổi đều được phản chiếu vào một vùng trực tiếp để trình đọc màn hình đọc lên.',
  },
  'settings.scale.label': {
    en: ['Scale', 'Scale', 'Scale', 'How big?', 'How big shall we make it all?'],
    vi: 'Tỉ lệ',
  },
  'settings.scale.option': {
    en: ['{percent}%', '{percent}%', '{percent}%', '{percent}%', '{percent}%'],
    vi: '{percent}%',
  },
  'settings.scale.desc': {
    en: [
      'Tested at {min}% to {max}%, and down to a {width}px window.',
      'Tested at {min}% to {max}%, and down to a {width}px window.',
      'It behaves from {min}% all the way to {max}%, and down to a {width}px window.',
      'It behaves from {min}% to {max}%, and squeezes down to a {width}px window without complaint.',
      'It holds its nerve from {min}% to {max}%, and squeezes down to a {width}px window without dropping a single pixel.',
    ],
    vi: 'Hoạt động tốt từ {min}% đến {max}%, và cả khi cửa sổ chỉ rộng {width}px.',
  },
  'settings.audio.mute.label': {
    en: ['Mute', 'Mute', 'Mute everything', 'Silence the lot', 'Silence the entire valley'],
    vi: 'Tắt hết âm thanh',
  },
  'settings.audio.mute.desc': {
    en: [
      'Audio never starts before your first input.',
      'Audio never starts before your first input.',
      'Sound never starts until you press something first.',
      'Sound will not make a peep until you press something first.',
      'Sound will not make a single peep until you press something. It has manners.',
    ],
    vi: 'Âm thanh sẽ không bao giờ bắt đầu cho đến khi bạn bấm vào một thứ gì đó trước.',
  },
  'settings.audio.test': {
    en: ['Play a test sound', 'Play a test sound', 'Play a test sound', 'Give me a sound', 'Let us hear a sound, then'],
    vi: 'Phát âm thanh thử',
  },
  'settings.game.seed.label': {
    en: ['Farm seed', 'Farm seed', 'The seed this farm grew from', 'The seed this whole farm grew from', 'The single number this entire valley grew out of'],
    vi: 'Hạt giống mà trang trại này mọc lên từ đó',
  },
  'settings.game.seed.desc': {
    en: [
      'Seed {seed}. The same seed always lays out the same farm.',
      'Seed {seed}. The same seed always lays out the same farm.',
      'Seed {seed}. The same seed always grows the same farm, rock for rock.',
      'Seed {seed}. The same seed grows the same farm every time, rock for rock, weed for weed.',
      'Seed {seed}. Feed it the same number and it lays down the same valley, rock for rock, weed for weed, forever.',
    ],
    vi: 'Hạt giống {seed}. Cùng một hạt giống luôn mọc ra cùng một trang trại, từng hòn đá một.',
  },
  'settings.game.newFarm': {
    en: ['Start a new farm', 'Start a new farm', 'Start a new farm', 'Start again on fresh soil', 'Abandon this valley and begin again on fresh soil'],
    vi: 'Bắt đầu trang trại mới',
  },
  'settings.game.newFarm.confirm.title': {
    en: ['Start a new farm?', 'Start a new farm?', 'Start a new farm?', 'Really start over?', 'Truly abandon this valley?'],
    vi: 'Bắt đầu trang trại mới?',
  },
  'settings.game.newFarm.confirm.body': {
    en: [
      'The current save is deleted. {days} days of work go with it.',
      'The current save is deleted. {days} days of work go with it.',
      'The current save is deleted, and {days} days of work go with it.',
      'The current save goes in the bin, and {days} days of work go with it.',
      'The current save goes in the bin, and {days} days of honest labour go with it, unmourned.',
    ],
    vi: 'Bản lưu hiện tại sẽ bị xóa, kéo theo {days} ngày công sức của bạn.',
  },
  'settings.data.export.label': {
    en: ['Export', 'Export', 'Export your data', 'Take a copy of everything', 'Pack the whole valley into a file and take it with you'],
    vi: 'Xuất dữ liệu của bạn',
  },
  'settings.data.import.label': {
    en: ['Import', 'Import', 'Import data', 'Bring data back in', 'Bring a whole valley back in from a file'],
    vi: 'Nhập dữ liệu',
  },
  'settings.data.reset.label': {
    en: ['Reset everything', 'Reset everything', 'Reset everything', 'Wipe the lot', 'Wipe the lot and start from nothing'],
    vi: 'Đặt lại mọi thứ',
  },
  'settings.data.reset.desc': {
    en: [
      'Deletes settings, appearance, tabs and history on this computer.',
      'Deletes settings, appearance, tabs and history on this computer.',
      'Deletes your settings, appearance, tabs and history from this computer.',
      'Deletes your settings, appearance, tabs and history. There is no undo.',
      'Deletes settings, appearance, tabs and history. There is no undo, no backup and no mercy.',
    ],
    vi: 'Xóa cài đặt, giao diện, thẻ và lịch sử của bạn khỏi máy tính này.',
  },
  'settings.data.reset.confirm.title': {
    en: ['Reset everything?', 'Reset everything?', 'Reset everything?', 'Really wipe the lot?', 'Truly wipe every last trace?'],
    vi: 'Đặt lại mọi thứ?',
  },
  'settings.data.reset.confirm.body': {
    en: [
      'This cannot be undone.',
      'This cannot be undone.',
      'There is no undo for this one.',
      'There is no undo, no backup and no second chance.',
      'There is no undo, no backup, no second chance and no kindly stranger to restore it.',
    ],
    vi: 'Lần này không hoàn tác được đâu.',
  },
  'settings.data.reset.done': {
    en: ['Everything is reset.', 'Everything is reset.', 'Everything is back to how it started.', 'Done — everything is back to how it started.', 'Done. Everything is exactly as it was on the first morning.'],
    vi: 'Mọi thứ đã trở về như lúc ban đầu.',
  },
  'settings.about.version': {
    en: ['Version {version}', 'Version {version}', 'Version {version}', 'Version {version}', 'Version {version}, freshly minted'],
    vi: 'Phiên bản {version}',
  },
  'settings.about.licence': {
    en: ['Licence: {licence}', 'Licence: {licence}', 'Licensed under {licence}', 'Licensed under {licence}', 'Licensed under {licence}, generously'],
    vi: 'Cấp phép theo {licence}',
  },
  'settings.about.author': {
    en: ['Made by {author}', 'Made by {author}', 'Made by {author}', 'Made by {author}', 'Made, pixel by pixel, by {author}'],
    vi: 'Do {author} làm ra',
  },
  'settings.about.offline': {
    en: [
      'This app makes no network requests.',
      'This app makes no network requests.',
      'This app never talks to the network. Not once.',
      'This app never talks to the network. Not once, not ever.',
      'This app never talks to the network. Not once, not ever, not even to say hello.',
    ],
    vi: 'Ứng dụng này không bao giờ kết nối mạng. Không một lần nào.',
  },

  // =========================================================================
  // appearance editor
  // =========================================================================

  'appearance.open': {
    en: ['Edit appearance…', 'Edit appearance…', 'Edit how this looks…', 'Change how this looks…', 'Take this element aside and redress it…'],
    vi: 'Chỉnh giao diện này…',
  },
  'appearance.editor.title': {
    en: ['Appearance of {element}', 'Appearance of {element}', 'How {element} looks', 'Dressing up {element}', 'The complete wardrobe of {element}'],
    vi: 'Giao diện của {element}',
  },
  'appearance.editor.hint': {
    en: [
      'Right-click any element, or press {keys} while it has focus.',
      'Right-click any element, or press {keys} while it has focus.',
      'Right-click anything here, or press {keys} while it has focus.',
      'Right-click anything at all, or press {keys} while it has focus.',
      'Right-click anything at all, or press {keys} while it has focus. Nothing is safe from you.',
    ],
    vi: 'Nhấp chuột phải vào bất cứ thứ gì ở đây, hoặc bấm {keys} khi nó đang được chọn.',
  },
  'appearance.field.color': {
    en: ['Text colour', 'Text colour', 'Text colour', 'Colour of the text', 'The colour the words are wearing'],
    vi: 'Màu chữ',
  },
  'appearance.field.background': {
    en: ['Background', 'Background', 'Background colour', 'Colour behind it', 'The colour standing behind it'],
    vi: 'Màu nền',
  },
  'appearance.field.border': {
    en: ['Border colour', 'Border colour', 'Border colour', 'Colour of the frame', 'The colour of the carved wooden frame'],
    vi: 'Màu viền',
  },
  'appearance.field.size': {
    en: ['Text size', 'Text size', 'Text size', 'How big the text is', 'How big the words are allowed to be'],
    vi: 'Cỡ chữ',
  },
  'appearance.field.spacing': {
    en: ['Spacing', 'Spacing', 'Spacing', 'Room around it', 'How much room it gets to breathe'],
    vi: 'Khoảng cách',
  },
  'appearance.field.weight': {
    en: ['Weight', 'Weight', 'Weight', 'How bold it is', 'How bold it dares to be'],
    vi: 'Độ đậm',
  },
  'appearance.field.align': {
    en: ['Alignment', 'Alignment', 'Alignment', 'Which way it lines up', 'Which way it chooses to line up'],
    vi: 'Căn lề',
  },
  'appearance.field.visible': {
    en: ['Visible', 'Visible', 'Shown or hidden', 'Shown, or hidden away', 'Present, or spirited away entirely'],
    vi: 'Hiện hoặc ẩn',
  },
  'appearance.value.inherited': {
    en: ['Inherited', 'Inherited', 'Inherited from the theme', 'Whatever the theme says', 'Whatever the theme decrees'],
    vi: 'Kế thừa từ giao diện chủ đề',
  },
  'appearance.changed': {
    en: ['{element} updated.', '{element} updated.', '{element} has a new look.', '{element} has had a makeover.', '{element} has been utterly transformed.'],
    vi: '{element} có diện mạo mới.',
  },
  'appearance.reset': {
    en: ['Reset {element}', 'Reset {element}', 'Put {element} back', 'Put {element} back how it was', 'Return {element} to its original state'],
    vi: 'Trả {element} về như cũ',
  },
  'appearance.reset.done': {
    en: ['{element} is back to the default.', '{element} is back to the default.', '{element} is back to how it started.', '{element} is back to how it started, no harm done.', '{element} has returned to the default, older and wiser.'],
    vi: '{element} đã trở về như lúc ban đầu.',
  },
  'appearance.resetAll': {
    en: ['Reset all appearance', 'Reset all appearance', 'Reset every appearance change', 'Undo every appearance change', 'Undo every last appearance change in one sweep'],
    vi: 'Đặt lại mọi thay đổi giao diện',
  },
  'appearance.resetAll.confirm.body': {
    en: ['{count} elements go back to their defaults.', '{count} elements go back to their defaults.', '{count} elements go back to how they started.', '{count} elements go back to how they started. No undo.', '{count} elements march back to their defaults. There is no undo.'],
    vi: '{count} phần tử sẽ trở về như lúc ban đầu.',
  },
  'search.appearance.label': {
    en: ['Search appearance settings', 'Search appearance settings', 'Search the appearance settings', 'Hunt through the appearance settings', 'Interrogate every appearance setting there is'],
    vi: 'Tìm trong cài đặt giao diện',
  },
  'search.appearance.placeholder': {
    en: ['Search appearance', 'Search appearance', 'Search appearance', 'What do you want to change?', 'Name what you want changed'],
    vi: 'Tìm giao diện',
  },

  // =========================================================================
  // colour picker
  // =========================================================================

  'color.picker.title': {
    en: ['Colour', 'Colour', 'Pick a colour', 'Pick a colour', 'Choose a colour, any colour'],
    vi: 'Chọn một màu',
  },
  'color.area.label': {
    en: ['Saturation and brightness', 'Saturation and brightness', 'Saturation and brightness', 'Drag for saturation and brightness', 'Drag about for saturation and brightness'],
    vi: 'Độ bão hòa và độ sáng',
  },
  'color.hue.label': {
    en: ['Hue', 'Hue', 'Hue', 'Hue', 'Hue, the whole rainbow of it'],
    vi: 'Sắc độ',
  },
  'color.alpha.label': {
    en: ['Opacity', 'Opacity', 'Opacity', 'How solid it is', 'How solid, or how ghostly'],
    vi: 'Độ mờ đục',
  },
  'color.field.hex': {
    en: ['Hex', 'Hex', 'Hex', 'Hex', 'Hex, for the purists'],
    vi: 'Hex',
  },
  'color.field.rgb': {
    en: ['RGB', 'RGB', 'RGB', 'RGB', 'RGB, red green blue, the old way'],
    vi: 'RGB',
  },
  'color.field.hsl': {
    en: ['HSL', 'HSL', 'HSL', 'HSL', 'HSL, for people who think in hues'],
    vi: 'HSL',
  },
  'color.field.palette': {
    en: ['Palette colour', 'Palette colour', 'From the palette', 'From the valley palette', 'Straight from the valley palette itself'],
    vi: 'Từ bảng màu',
  },
  'color.sync.note': {
    en: [
      'Editing one representation updates the others.',
      'Editing one representation updates the others.',
      'Change any one of these and the rest follow along.',
      'Change any one of these and the rest follow, instantly.',
      'Change any one of these and the rest fall into line at once, obediently.',
    ],
    vi: 'Đổi bất kỳ ô nào trong số này, các ô còn lại sẽ tự theo.',
  },
  'color.invalid': {
    en: ['{value} is not a colour.', '{value} is not a colour.', '{value} is not a colour this understands.', '{value} is not a colour, sorry.', '{value} is not a colour, and no amount of squinting will make it one.'],
    vi: '{value} không phải là màu mà ứng dụng hiểu được.',
  },
  'color.current': {
    en: ['Current colour {value}', 'Current colour {value}', 'Currently {value}', 'Currently wearing {value}', 'Currently wearing {value}, and wearing it well'],
    vi: 'Hiện là {value}',
  },
  'color.contrast': {
    en: ['Contrast {ratio} to 1', 'Contrast {ratio} to 1', 'Contrast is {ratio} to 1', 'Contrast sits at {ratio} to 1', 'Contrast stands proudly at {ratio} to 1'],
    vi: 'Độ tương phản là {ratio} trên 1',
  },
  'color.contrast.warn': {
    en: [
      'Contrast {ratio} to 1 is below the required {required} to 1.',
      'Contrast {ratio} to 1 is below the required {required} to 1.',
      'Contrast is only {ratio} to 1, under the {required} to 1 this needs.',
      'Contrast is a feeble {ratio} to 1, under the {required} to 1 this needs.',
      'Contrast limps in at {ratio} to 1, well under the {required} to 1 it is meant to clear.',
    ],
    vi: 'Độ tương phản chỉ {ratio} trên 1, thấp hơn mức {required} trên 1 cần có.',
  },
  'search.color.label': {
    en: ['Search palette colours', 'Search palette colours', 'Search the palette', 'Hunt through the palette', 'Interrogate all fourteen palette colours'],
    vi: 'Tìm trong bảng màu',
  },
  'search.color.placeholder': {
    en: ['Search colours', 'Search colours', 'Search colours', 'Which colour?', 'Name the colour you want'],
    vi: 'Tìm màu',
  },
  'color.name.ink': {
    en: ['Ink', 'Ink', 'Ink', 'Ink', 'Ink'],
    vi: 'Mực',
  },
  'color.name.shadow': {
    en: ['Shadow', 'Shadow', 'Shadow', 'Shadow', 'Shadow'],
    vi: 'Bóng tối',
  },
  'color.name.bark': {
    en: ['Bark', 'Bark', 'Bark', 'Bark', 'Bark'],
    vi: 'Vỏ cây',
  },
  'color.name.soil': {
    en: ['Soil', 'Soil', 'Soil', 'Soil', 'Soil'],
    vi: 'Đất',
  },
  'color.name.soilWet': {
    en: ['Wet soil', 'Wet soil', 'Wet soil', 'Wet soil', 'Wet soil'],
    vi: 'Đất ướt',
  },
  'color.name.grass': {
    en: ['Grass', 'Grass', 'Grass', 'Grass', 'Grass'],
    vi: 'Cỏ',
  },
  'color.name.grassLit': {
    en: ['Lit grass', 'Lit grass', 'Lit grass', 'Lit grass', 'Lit grass'],
    vi: 'Cỏ sáng',
  },
  'color.name.leaf': {
    en: ['Leaf', 'Leaf', 'Leaf', 'Leaf', 'Leaf'],
    vi: 'Lá',
  },
  'color.name.parchment': {
    en: ['Parchment', 'Parchment', 'Parchment', 'Parchment', 'Parchment'],
    vi: 'Giấy da',
  },
  'color.name.cream': {
    en: ['Cream', 'Cream', 'Cream', 'Cream', 'Cream'],
    vi: 'Kem',
  },
  'color.name.lantern': {
    en: ['Lantern', 'Lantern', 'Lantern', 'Lantern', 'Lantern'],
    vi: 'Đèn lồng',
  },
  'color.name.berry': {
    en: ['Berry', 'Berry', 'Berry', 'Berry', 'Berry'],
    vi: 'Quả mọng',
  },
  'color.name.sky': {
    en: ['Sky', 'Sky', 'Sky', 'Sky', 'Sky'],
    vi: 'Bầu trời',
  },
  'color.name.dusk': {
    en: ['Dusk', 'Dusk', 'Dusk', 'Dusk', 'Dusk'],
    vi: 'Hoàng hôn',
  },

  // =========================================================================
  // the search field and its regex builder
  // =========================================================================

  'search.clear': {
    en: ['Clear the search', 'Clear the search', 'Clear the search', 'Wipe the search', 'Wipe the search and start afresh'],
    vi: 'Xóa ô tìm kiếm',
  },
  'search.mode.plain': {
    en: ['Plain text', 'Plain text', 'Plain text', 'Just plain text', 'Just plain honest text'],
    vi: 'Văn bản thường',
  },
  'search.mode.regex': {
    en: ['Regular expression', 'Regular expression', 'Regular expression', 'Regular expression, if you dare', 'Regular expression, for the brave'],
    vi: 'Biểu thức chính quy',
  },
  'search.mode.hint': {
    en: [
      'Plain text is the default. Turn on regex to write a pattern.',
      'Plain text is the default. Turn on regex to write a pattern.',
      'Plain text unless you say otherwise — flip regex on to write a real pattern.',
      'Plain text unless you say otherwise. Flip regex on and write a real pattern.',
      'Plain text unless you say otherwise. Flip regex on and the full machinery awaits you.',
    ],
    vi: 'Mặc định là văn bản thường — bật regex nếu bạn muốn viết một mẫu thực thụ.',
  },
  'search.results': {
    en: ['{count} results', '{count} results', '{count} results', '{count} results found', '{count} results, hunted down and presented'],
    vi: '{count} kết quả',
  },
  'search.results.none': {
    en: ['Nothing matches {query}.', 'Nothing matches {query}.', 'Nothing matches {query}.', 'Not one thing matches {query}.', 'Not one single thing answers to {query}.'],
    vi: 'Không có gì khớp với {query}.',
  },
  'search.builder.open': {
    en: ['Open the pattern builder', 'Open the pattern builder', 'Open the pattern builder', 'Open the pattern builder', 'Summon the pattern builder'],
    vi: 'Mở trình dựng mẫu',
  },
  'search.builder.close': {
    en: ['Close the pattern builder', 'Close the pattern builder', 'Close the pattern builder', 'Put the pattern builder away', 'Dismiss the pattern builder, with thanks'],
    vi: 'Đóng trình dựng mẫu',
  },
  'regex.title': {
    en: ['Pattern builder', 'Pattern builder', 'Pattern builder', 'Pattern builder', 'The pattern builder, at your service'],
    vi: 'Trình dựng mẫu',
  },
  'regex.dialect': {
    en: [
      'Dialect: {dialect}.',
      'Dialect: {dialect}.',
      'This builds a {dialect} pattern.',
      'This builds a {dialect} pattern, and nothing else.',
      'This builds a {dialect} pattern, and nothing else. No lookbehind fantasies.',
    ],
    vi: 'Trình này dựng mẫu {dialect}.',
  },
  'regex.pattern.label': {
    en: ['Pattern', 'Pattern', 'The pattern', 'The pattern itself', 'The pattern itself, raw and unashamed'],
    vi: 'Mẫu',
  },
  'regex.pattern.placeholder': {
    en: ['Type a pattern', 'Type a pattern', 'Type a pattern', 'Type a pattern, or build one below', 'Type a pattern, or let the builder below do the work'],
    vi: 'Nhập một mẫu',
  },
  'regex.flags.label': {
    en: ['Flags', 'Flags', 'Flags', 'Flags', 'Flags, the small print of a pattern'],
    vi: 'Cờ',
  },
  'regex.flag.i': {
    en: ['Ignore case', 'Ignore case', 'Ignore upper and lower case', 'Do not care about case', 'Treat upper and lower case as the same thing'],
    vi: 'Bỏ qua chữ hoa, chữ thường',
  },
  'regex.flag.g': {
    en: ['Find all matches', 'Find all matches', 'Find every match', 'Find every last match', 'Hunt down every last match'],
    vi: 'Tìm mọi kết quả khớp',
  },
  'regex.flag.m': {
    en: ['Multiline anchors', 'Multiline anchors', 'Anchors match each line', 'Anchors match each line, not just the whole text', 'Anchors bite at each line, not just the whole text'],
    vi: 'Neo khớp theo từng dòng',
  },
  'regex.flag.s': {
    en: ['Dot matches newline', 'Dot matches newline', 'The dot matches a newline too', 'The dot swallows newlines too', 'The dot swallows newlines too, greedily'],
    vi: 'Dấu chấm khớp cả ký tự xuống dòng',
  },
  'regex.flag.u': {
    en: ['Unicode', 'Unicode', 'Full Unicode', 'Full Unicode, emoji and all', 'Full Unicode, emoji, accents and all'],
    vi: 'Unicode đầy đủ',
  },
  'regex.flag.y': {
    en: ['Sticky', 'Sticky', 'Sticky — match from where it left off', 'Sticky: carry on from where it left off', 'Sticky: it carries on stubbornly from where it left off'],
    vi: 'Dính — khớp từ chỗ lần trước dừng lại',
  },
  'regex.piece.literal': {
    en: ['Literal text', 'Literal text', 'Literal text', 'Just this exact text', 'Exactly this text, character for character'],
    vi: 'Văn bản nguyên văn',
  },
  'regex.piece.charclass': {
    en: ['Character class', 'Character class', 'Any one of these characters', 'Any one of these characters', 'Any one character out of this little committee'],
    vi: 'Một trong những ký tự này',
  },
  'regex.piece.any': {
    en: ['Any character', 'Any character', 'Any character at all', 'Any character at all', 'Absolutely any character at all'],
    vi: 'Bất kỳ ký tự nào',
  },
  'regex.piece.digit': {
    en: ['A digit', 'A digit', 'A digit', 'A digit, zero to nine', 'A digit, zero through nine, no exceptions'],
    vi: 'Một chữ số',
  },
  'regex.piece.word': {
    en: ['A word character', 'A word character', 'A word character', 'A letter, digit or underscore', 'A letter, a digit or a humble underscore'],
    vi: 'Một ký tự chữ',
  },
  'regex.piece.space': {
    en: ['Whitespace', 'Whitespace', 'Whitespace', 'A space, tab or newline', 'A space, a tab or a newline — the invisible ones'],
    vi: 'Khoảng trắng',
  },
  'regex.piece.anchor.start': {
    en: ['Start of text', 'Start of text', 'Start of the text', 'Right at the start', 'Right at the very start, and nowhere else'],
    vi: 'Đầu văn bản',
  },
  'regex.piece.anchor.end': {
    en: ['End of text', 'End of text', 'End of the text', 'Right at the end', 'Right at the very end, and nowhere else'],
    vi: 'Cuối văn bản',
  },
  'regex.piece.wordboundary': {
    en: ['Word boundary', 'Word boundary', 'The edge of a word', 'The edge of a word', 'The invisible line at the edge of a word'],
    vi: 'Ranh giới của một từ',
  },
  'regex.piece.group': {
    en: ['Group', 'Group', 'Group', 'Group them together', 'Bundle them together as one'],
    vi: 'Nhóm',
  },
  'regex.piece.capture': {
    en: ['Capturing group', 'Capturing group', 'Capture this part', 'Capture this part for later', 'Capture this part and keep it for later'],
    vi: 'Bắt phần này',
  },
  'regex.piece.noncapture': {
    en: ['Non-capturing group', 'Non-capturing group', 'Group it without capturing', 'Group it, but do not keep it', 'Group it, but do not bother keeping it'],
    vi: 'Gom nhóm mà không bắt',
  },
  'regex.piece.alternation': {
    en: ['Either or', 'Either or', 'This or that', 'This one or that one', 'This one, or that one — the pattern will not mind'],
    vi: 'Cái này hoặc cái kia',
  },
  'regex.piece.quantifier': {
    en: ['Repeat', 'Repeat', 'Repeat it', 'How many times?', 'How many times shall it repeat?'],
    vi: 'Lặp lại',
  },
  'regex.quantifier.optional': {
    en: ['Once or not at all', 'Once or not at all', 'Once, or not at all', 'Once, or not at all', 'Once, or not at all — no pressure'],
    vi: 'Một lần, hoặc không lần nào',
  },
  'regex.quantifier.some': {
    en: ['One or more', 'One or more', 'One or more', 'At least one', 'At least one, and as many as it likes'],
    vi: 'Một hoặc nhiều lần',
  },
  'regex.quantifier.any': {
    en: ['Zero or more', 'Zero or more', 'Any number, including none', 'Any number at all, including none', 'Any number at all, none very much included'],
    vi: 'Bao nhiêu lần cũng được, kể cả không',
  },
  'regex.quantifier.exact': {
    en: ['Exactly {count}', 'Exactly {count}', 'Exactly {count} times', 'Exactly {count} times, no more', 'Exactly {count} times, not one more, not one fewer'],
    vi: 'Đúng {count} lần',
  },
  'regex.quantifier.range': {
    en: ['{min} to {max} times', '{min} to {max} times', '{min} to {max} times', 'Between {min} and {max} times', 'Somewhere between {min} and {max} times, inclusive'],
    vi: 'Từ {min} đến {max} lần',
  },
  'regex.piece.add': {
    en: ['Add {piece}', 'Add {piece}', 'Add {piece}', 'Add {piece} to the pattern', 'Add {piece} to the growing pattern'],
    vi: 'Thêm {piece}',
  },
  'regex.piece.remove': {
    en: ['Remove {piece}', 'Remove {piece}', 'Take {piece} out', 'Take {piece} back out', 'Escort {piece} out of the pattern'],
    vi: 'Bỏ {piece} ra',
  },
  'regex.piece.moveUp': {
    en: ['Move {piece} earlier', 'Move {piece} earlier', 'Move {piece} earlier', 'Shift {piece} earlier', 'Shuffle {piece} one place earlier'],
    vi: 'Đưa {piece} lên trước',
  },
  'regex.piece.moveDown': {
    en: ['Move {piece} later', 'Move {piece} later', 'Move {piece} later', 'Shift {piece} later', 'Shuffle {piece} one place later'],
    vi: 'Đưa {piece} ra sau',
  },
  'regex.sample.label': {
    en: ['Sample text', 'Sample text', 'Sample text to try it on', 'Something to try it on', 'A victim to try the pattern on'],
    vi: 'Văn bản mẫu để thử',
  },
  'regex.sample.placeholder': {
    en: ['Paste some text here', 'Paste some text here', 'Paste some text here', 'Paste anything here', 'Paste anything at all here'],
    vi: 'Dán một đoạn văn bản vào đây',
  },
  'regex.sample.limit': {
    en: [
      'The sample is limited to {max} characters.',
      'The sample is limited to {max} characters.',
      'The sample stops at {max} characters.',
      'The sample stops at {max} characters, for everyone’s sake.',
      'The sample stops dead at {max} characters, for the good of us all.',
    ],
    vi: 'Văn bản mẫu tối đa {max} ký tự.',
  },
  'regex.sample.truncatedInput': {
    en: ['The sample was cut to {max} characters.', 'The sample was cut to {max} characters.', 'The sample was trimmed to {max} characters.', 'The sample was trimmed down to {max} characters.', 'The sample was trimmed down to {max} characters. The rest is on the cutting room floor.'],
    vi: 'Văn bản mẫu đã bị cắt còn {max} ký tự.',
  },
  'regex.matches': {
    en: ['{count} matches', '{count} matches', '{count} matches', '{count} matches found', '{count} matches, rounded up and counted'],
    vi: '{count} kết quả khớp',
  },
  'regex.matches.none': {
    en: ['No matches.', 'No matches.', 'Nothing matched.', 'Nothing matched at all.', 'Nothing matched. Not one character volunteered.'],
    vi: 'Không có gì khớp.',
  },
  'regex.matches.truncated': {
    en: [
      'Showing the first {shown} of {limit}.',
      'Showing the first {shown} of {limit}.',
      'Showing the first {shown} — the limit is {limit}.',
      'Showing the first {shown}; the limit is {limit} and we hit it.',
      'Showing the first {shown}; the limit is {limit}, and we walked straight into it.',
    ],
    vi: 'Hiển thị {shown} kết quả đầu — giới hạn là {limit}.',
  },
  'regex.timeout': {
    en: [
      'The pattern was stopped after {ms} ms.',
      'The pattern was stopped after {ms} ms.',
      'The pattern was taking too long and was stopped after {ms} ms.',
      'The pattern went off wandering and was stopped after {ms} ms.',
      'The pattern wandered off into the wilderness and was hauled back after {ms} ms.',
    ],
    vi: 'Mẫu chạy quá lâu nên đã bị dừng sau {ms} ms.',
  },
  'regex.match.at': {
    en: ['Match at {index}: {text}', 'Match at {index}: {text}', 'Match at {index}: {text}', 'A match at {index}: {text}', 'A match, right at {index}: {text}'],
    vi: 'Khớp tại {index}: {text}',
  },
  'regex.match.empty': {
    en: ['Empty match at {index}', 'Empty match at {index}', 'An empty match at {index}', 'An empty match at {index} — it matched nothing at all', 'An empty match at {index}: it matched precisely nothing, and was proud of it'],
    vi: 'Một kết quả khớp rỗng tại {index}',
  },
  'regex.group.numbered': {
    en: ['Group {n}: {text}', 'Group {n}: {text}', 'Group {n}: {text}', 'Group {n} caught: {text}', 'Group {n} came back holding: {text}'],
    vi: 'Nhóm {n}: {text}',
  },
  'regex.group.named': {
    en: ['Group {name}: {text}', 'Group {name}: {text}', 'Group {name}: {text}', 'Group {name} caught: {text}', 'Group {name} came back holding: {text}'],
    vi: 'Nhóm {name}: {text}',
  },
  'regex.valid': {
    en: ['The pattern is valid.', 'The pattern is valid.', 'The pattern is good.', 'The pattern is good to go.', 'The pattern is in perfect health.'],
    vi: 'Mẫu hợp lệ.',
  },
  'regex.error': {
    en: ['The pattern is not valid: {error}', 'The pattern is not valid: {error}', 'That pattern does not work: {error}', 'That pattern is broken: {error}', 'That pattern is a shambles, and here is why: {error}'],
    vi: 'Mẫu này không dùng được: {error}',
  },
  'regex.error.at': {
    en: ['The pattern is not valid at character {index}: {error}', 'The pattern is not valid at character {index}: {error}', 'The pattern breaks at character {index}: {error}', 'The pattern falls over at character {index}: {error}', 'The pattern falls flat on its face at character {index}: {error}'],
    vi: 'Mẫu bị lỗi ở ký tự {index}: {error}',
  },
  'regex.empty': {
    en: ['An empty pattern matches everything.', 'An empty pattern matches everything.', 'An empty pattern matches everything, so nothing is filtered.', 'An empty pattern matches everything, which filters precisely nothing.', 'An empty pattern matches everything, which is a grand way of filtering nothing at all.'],
    vi: 'Một mẫu rỗng khớp với mọi thứ, nên sẽ không lọc gì cả.',
  },
  'regex.escape.note': {
    en: [
      'Plain text is escaped for you: {chars} lose their special meaning.',
      'Plain text is escaped for you: {chars} lose their special meaning.',
      'In plain mode we escape it for you, so {chars} lose their special meaning.',
      'In plain mode we escape it for you, so {chars} behave like ordinary characters.',
      'In plain mode we escape it for you, so {chars} are stripped of their powers and behave.',
    ],
    vi: 'Ở chế độ văn bản thường, ứng dụng sẽ tự thoát ký tự giúp bạn, nên {chars} mất đi ý nghĩa đặc biệt.',
  },
  'regex.copy': {
    en: ['Copy the pattern', 'Copy the pattern', 'Copy the pattern', 'Grab a copy of the pattern', 'Take a copy of this fine pattern'],
    vi: 'Sao chép mẫu',
  },
  'regex.export': {
    en: ['Export the pattern and matches', 'Export the pattern and matches', 'Export the pattern and its matches', 'Export the pattern and everything it caught', 'Export the pattern and every last thing it caught'],
    vi: 'Xuất mẫu và các kết quả khớp',
  },
  'regex.notPersisted': {
    en: [
      'Patterns are not saved. This one lives only while the field is open.',
      'Patterns are not saved. This one lives only while the field is open.',
      'Patterns are never saved — this one lives only while the field is open.',
      'Patterns are never saved. This one exists only while the field is open.',
      'Patterns are never saved. This one exists only while the field is open, then vanishes without trace.',
    ],
    vi: 'Các mẫu không bao giờ được lưu — mẫu này chỉ tồn tại khi ô nhập còn mở.',
  },

  // =========================================================================
  // the search catalogue
  // =========================================================================

  'catalogue.title': {
    en: ['Search surfaces', 'Search surfaces', 'Every search in the app', 'Every search field in the app', 'Every last search field this app owns'],
    vi: 'Mọi ô tìm kiếm trong ứng dụng',
  },
  'catalogue.desc': {
    en: [
      'Every list, table, picker and menu has a search field, and each one is listed here.',
      'Every list, table, picker and menu has a search field, and each one is listed here.',
      'Every list, table, picker and menu has its own search field, and they are all listed here.',
      'Every list, table, picker and menu has its own search field, and not one of them escapes this list.',
      'Every list, table, picker and menu has its own search field, and not one of them escapes this list. We checked.',
    ],
    vi: 'Mỗi danh sách, bảng, bộ chọn và menu đều có ô tìm kiếm riêng, và tất cả được liệt kê ở đây.',
  },
  'catalogue.column.id': {
    en: ['Identifier', 'Identifier', 'Identifier', 'Identifier', 'Its identifier'],
    vi: 'Mã định danh',
  },
  'catalogue.column.where': {
    en: ['Where it lives', 'Where it lives', 'Where it lives', 'Where you will find it', 'Where in the world you will find it'],
    vi: 'Nằm ở đâu',
  },
  'catalogue.column.what': {
    en: ['What it searches', 'What it searches', 'What it searches', 'What it actually searches', 'What it actually goes looking through'],
    vi: 'Tìm cái gì',
  },
  'catalogue.count': {
    en: ['{count} search fields.', '{count} search fields.', '{count} search fields in total.', '{count} search fields, all present and correct.', '{count} search fields, all present, correct and accounted for.'],
    vi: 'Tổng cộng {count} ô tìm kiếm.',
  },
  'search.catalogue.label': {
    en: ['Search the catalogue', 'Search the catalogue', 'Search the catalogue of searches', 'Search the catalogue of searches', 'Search the catalogue of searches, which is admittedly funny'],
    vi: 'Tìm trong danh mục các ô tìm kiếm',
  },
  'search.catalogue.placeholder': {
    en: ['Search fields', 'Search fields', 'Search fields', 'Which search field?', 'Which search field are you after?'],
    vi: 'Tìm ô tìm kiếm',
  },

  // =========================================================================
  // command palette
  // =========================================================================

  'palette.title': {
    en: ['Command palette', 'Command palette', 'Command palette', 'Command palette', 'The command palette, keeper of every shortcut'],
    vi: 'Bảng lệnh',
  },
  'palette.label': {
    en: ['Search commands and places', 'Search commands and places', 'Search commands and places', 'Search every command and place', 'Search every command and every place worth going'],
    vi: 'Tìm lệnh và nơi cần đến',
  },
  'palette.placeholder': {
    en: ['Type a command', 'Type a command', 'Type a command or a place', 'What do you want to do?', 'Say the word and it shall be done'],
    vi: 'Nhập một lệnh hoặc một nơi',
  },
  'palette.hint': {
    en: ['Open it with {keys}.', 'Open it with {keys}.', 'Open it any time with {keys}.', 'Open it any time with {keys}.', 'Summon it any time at all with {keys}.'],
    vi: 'Mở nó bất cứ lúc nào bằng {keys}.',
  },
  'palette.group.commands': {
    en: ['Commands', 'Commands', 'Commands', 'Things to do', 'Things you could do right now'],
    vi: 'Lệnh',
  },
  'palette.group.tabs': {
    en: ['Tabs', 'Tabs', 'Tabs', 'Tabs to jump to', 'Tabs waiting to be visited'],
    vi: 'Thẻ',
  },
  'palette.group.settings': {
    en: ['Settings', 'Settings', 'Settings', 'Settings to jump to', 'Settings waiting to be adjusted'],
    vi: 'Cài đặt',
  },
  'palette.group.appearance': {
    en: ['Appearance', 'Appearance', 'Appearance', 'Things you can restyle', 'Things you can restyle to your heart’s content'],
    vi: 'Giao diện',
  },
  'palette.group.docs': {
    en: ['Documentation', 'Documentation', 'Documentation', 'Things to read', 'Things to read on a quiet evening'],
    vi: 'Tài liệu',
  },
  'palette.group.history': {
    en: ['History', 'History', 'History', 'What you have done', 'Everything you have already done'],
    vi: 'Lịch sử',
  },
  'palette.empty': {
    en: ['Nothing matches {query}.', 'Nothing matches {query}.', 'Nothing matches {query}.', 'Nothing at all matches {query}.', 'Nothing whatsoever answers to {query}.'],
    vi: 'Không có gì khớp với {query}.',
  },
  'palette.count': {
    en: ['{count} results', '{count} results', '{count} results', '{count} results ready', '{count} results, lined up and waiting'],
    vi: '{count} kết quả',
  },
  'palette.run': {
    en: ['Run {title}', 'Run {title}', 'Run {title}', 'Go on then, run {title}', 'Unleash {title} upon the world'],
    vi: 'Chạy {title}',
  },
  'palette.goto': {
    en: ['Go to {title}', 'Go to {title}', 'Go to {title}', 'Take me to {title}', 'Whisk me away to {title}'],
    vi: 'Đi tới {title}',
  },
  'palette.regexToggle': {
    en: ['Match with a regular expression', 'Match with a regular expression', 'Match with a regular expression', 'Match with a regular expression instead', 'Match with a full regular expression, if you insist'],
    vi: 'So khớp bằng biểu thức chính quy',
  },

  // ---- commands -----------------------------------------------------------

  'cmd.openSettings': {
    en: ['Open settings', 'Open settings', 'Open settings', 'Open the settings', 'Fling open the settings'],
    vi: 'Mở cài đặt',
  },
  'cmd.openAlmanac': {
    en: ['Open the almanac', 'Open the almanac', 'Open the almanac', 'Open the almanac', 'Open the almanac and read up'],
    vi: 'Mở niên giám',
  },
  'cmd.openLedger': {
    en: ['Open the ledger', 'Open the ledger', 'Open the ledger', 'Open the ledger', 'Open the ledger and face the numbers'],
    vi: 'Mở sổ cái',
  },
  'cmd.openChangelog': {
    en: ['Open the changelog', 'Open the changelog', 'Open the changelog', 'Open the changelog', 'Open the changelog and see what changed'],
    vi: 'Mở nhật ký thay đổi',
  },
  'cmd.openHistory': {
    en: ['Open the history', 'Open the history', 'Open the history', 'Open your history', 'Open your history and face the past'],
    vi: 'Mở lịch sử',
  },
  'cmd.focusFarm': {
    en: ['Go to the farm', 'Go to the farm', 'Back to the farm', 'Back to the farm', 'Back to the farm, where the work is'],
    vi: 'Quay về trang trại',
  },
  'cmd.newTab': {
    en: ['New tab', 'New tab', 'Open a new tab', 'Open a new tab', 'Open a brand new tab'],
    vi: 'Mở thẻ mới',
  },
  'cmd.closeTab': {
    en: ['Close this tab', 'Close this tab', 'Close this tab', 'Close this tab', 'Close this tab and be done with it'],
    vi: 'Đóng thẻ này',
  },
  'cmd.nextTab': {
    en: ['Next tab', 'Next tab', 'Next tab', 'On to the next tab', 'On to the next tab, quickly'],
    vi: 'Thẻ kế tiếp',
  },
  'cmd.prevTab': {
    en: ['Previous tab', 'Previous tab', 'Previous tab', 'Back to the last tab', 'Back to the last tab, quickly'],
    vi: 'Thẻ trước',
  },
  'cmd.setLang': {
    en: ['Switch to {lang}', 'Switch to {lang}', 'Switch to {lang}', 'Switch over to {lang}', 'Switch the whole app over to {lang}'],
    vi: 'Chuyển sang {lang}',
  },
  'cmd.funnyUp': {
    en: ['Funnier', 'Funnier', 'Make it funnier', 'Turn the funny up', 'Turn the funny up and stand well back'],
    vi: 'Hài hước hơn nữa',
  },
  'cmd.funnyDown': {
    en: ['Less funny', 'Less funny', 'Make it plainer', 'Turn the funny down', 'Turn the funny down and let us all breathe'],
    vi: 'Đơn giản hơn chút',
  },
  'cmd.toggleMute': {
    en: ['Mute or unmute', 'Mute or unmute', 'Mute or unmute', 'Silence it, or bring it back', 'Silence the valley, or wake it up again'],
    vi: 'Tắt hoặc bật tiếng',
  },
  'cmd.toggleMotion': {
    en: ['Toggle reduced motion', 'Toggle reduced motion', 'Turn reduced motion on or off', 'Calm the motion down, or let it loose', 'Calm the motion down, or let the whole valley sway again'],
    vi: 'Bật hoặc tắt giảm chuyển động',
  },
  'cmd.zoomIn': {
    en: ['Increase the scale', 'Increase the scale', 'Make everything bigger', 'Make everything bigger', 'Make everything gloriously bigger'],
    vi: 'Phóng to mọi thứ',
  },
  'cmd.zoomOut': {
    en: ['Decrease the scale', 'Decrease the scale', 'Make everything smaller', 'Make everything smaller', 'Make everything modestly smaller'],
    vi: 'Thu nhỏ mọi thứ',
  },
  'cmd.zoomReset': {
    en: ['Reset the scale', 'Reset the scale', 'Back to the normal scale', 'Back to the normal scale', 'Back to the normal scale, and no arguing'],
    vi: 'Về tỉ lệ bình thường',
  },
  'cmd.exportData': {
    en: ['Export data', 'Export data', 'Export your data', 'Take a copy of everything', 'Pack it all up and take it with you'],
    vi: 'Xuất dữ liệu của bạn',
  },
  'cmd.resetAll': {
    en: ['Reset everything', 'Reset everything', 'Reset everything', 'Wipe the lot', 'Wipe the lot and start from nothing'],
    vi: 'Đặt lại mọi thứ',
  },
  'cmd.copyDiagnostics': {
    en: ['Copy diagnostics', 'Copy diagnostics', 'Copy the diagnostics', 'Copy the diagnostics', 'Copy the diagnostics, for when things go wrong'],
    vi: 'Sao chép thông tin chẩn đoán',
  },
  'cmd.surprise': {
    en: ['Show the surprise', 'Show the surprise', 'Show the surprise', 'Show me the surprise', 'Show me the surprise, I have earned it'],
    vi: 'Cho xem điều bất ngờ',
  },
  'cmd.minimise': {
    en: ['Minimise the window', 'Minimise the window', 'Minimise the window', 'Tuck the window away', 'Send the window away for a moment'],
    vi: 'Thu nhỏ cửa sổ',
  },
  'cmd.maximise': {
    en: ['Maximise the window', 'Maximise the window', 'Fill the screen', 'Take the whole screen', 'Seize the entire screen'],
    vi: 'Toàn màn hình',
  },
  'cmd.closeWindow': {
    en: ['Close the window', 'Close the window', 'Close the window', 'Close the window', 'Close the window and call it a day'],
    vi: 'Đóng cửa sổ',
  },

  // =========================================================================
  // notifications and dialogs
  // =========================================================================

  'notify.region.label': {
    en: ['Notifications', 'Notifications', 'Notifications', 'Notifications', 'Notifications, stacked politely'],
    vi: 'Thông báo',
  },
  'notify.dismiss': {
    en: ['Dismiss', 'Dismiss', 'Dismiss this', 'Away with it', 'Away with it, we have all read it'],
    vi: 'Bỏ qua thông báo này',
  },
  'notify.dismissAll': {
    en: ['Dismiss all', 'Dismiss all', 'Dismiss them all', 'Clear the whole stack', 'Clear the whole stack in one sweep'],
    vi: 'Bỏ qua tất cả',
  },
  'notify.paused': {
    en: ['Paused while you read it.', 'Paused while you read it.', 'Paused while you read it.', 'It will wait while you read it.', 'It will wait patiently while you read it. Take your time.'],
    vi: 'Tạm dừng trong lúc bạn đọc.',
  },
  'notify.progress': {
    en: ['{label}: {percent}%', '{label}: {percent}%', '{label} — {percent}%', '{label}, {percent}% of the way there', '{label}, {percent}% of the way there and going strong'],
    vi: '{label} — {percent}%',
  },
  'notify.progress.done': {
    en: ['{label} finished.', '{label} finished.', '{label} is done.', '{label} is done and dusted.', '{label} is done, dusted and filed away.'],
    vi: '{label} đã xong.',
  },
  'notify.success': {
    en: ['Done.', 'Done.', 'Done.', 'All done.', 'All done, and rather neatly too.'],
    vi: 'Xong rồi.',
  },
  'notify.failure': {
    en: ['That failed: {error}', 'That failed: {error}', 'That did not work: {error}', 'That fell over: {error}', 'That fell over spectacularly: {error}'],
    vi: 'Không thành công: {error}',
  },
  'dialog.confirm.title': {
    en: ['Are you sure?', 'Are you sure?', 'Are you sure?', 'Really sure?', 'Really, truly, absolutely sure?'],
    vi: 'Bạn chắc chứ?',
  },
  'dialog.confirm': {
    en: ['Confirm', 'Confirm', 'Yes, do it', 'Yes, do it', 'Yes. Do it.'],
    vi: 'Vâng, làm đi',
  },
  'dialog.destructive.note': {
    en: ['This cannot be undone.', 'This cannot be undone.', 'There is no undo for this.', 'There is no undo for this one.', 'There is no undo, no backup and no going back.'],
    vi: 'Không hoàn tác được đâu.',
  },
  'dialog.escapeHint': {
    en: ['Press {keys} to cancel.', 'Press {keys} to cancel.', 'Press {keys} to back out.', 'Press {keys} if you have changed your mind.', 'Press {keys} if you have thought better of it.'],
    vi: 'Bấm {keys} để thoát ra.',
  },

  // =========================================================================
  // tab titles
  // =========================================================================

  'tab.farm': {
    en: ['Farm', 'Farm', 'The farm', 'The farm', 'The farm, and everything on it'],
    vi: 'Trang trại',
  },
  'tab.settings': {
    en: ['Settings', 'Settings', 'Settings', 'Settings', 'Settings'],
    vi: 'Cài đặt',
  },
  'tab.almanac': {
    en: ['Almanac', 'Almanac', 'Almanac', 'The almanac', 'The almanac, keeper of every number'],
    vi: 'Niên giám',
  },
  'tab.changelog': {
    en: ['Changelog', 'Changelog', 'Changelog', 'The changelog', 'The changelog, honest to a fault'],
    vi: 'Nhật ký thay đổi',
  },
  'tab.history': {
    en: ['History', 'History', 'History', 'Your history', 'Your history, every last entry of it'],
    vi: 'Lịch sử',
  },
  'tab.surprise': {
    en: ['Surprise', 'Surprise', 'Surprise', 'A surprise', 'A surprise, drawn by hand'],
    vi: 'Bất ngờ',
  },
  'tab.ledger': {
    en: ['Ledger', 'Ledger', 'Ledger', 'The ledger', 'The ledger, where the money tells on you'],
    vi: 'Sổ cái',
  },

  // =========================================================================
  // almanac
  // =========================================================================

  'almanac.title': {
    en: ['Almanac', 'Almanac', 'The almanac', 'The almanac', 'The almanac — everything worth knowing'],
    vi: 'Niên giám',
  },
  'almanac.intro': {
    en: [
      'Everything about the farm, kept offline.',
      'Everything about the farm, kept offline.',
      'Everything worth knowing about the farm, kept offline and read straight from the game.',
      'Everything worth knowing about the farm, kept offline and read straight from the game itself.',
      'Everything worth knowing about the farm, kept offline and read straight from the game itself — not one number retyped by hand.',
    ],
    vi: 'Mọi điều đáng biết về trang trại, lưu sẵn ngoại tuyến và đọc thẳng từ trò chơi.',
  },
  'almanac.section.howto': {
    en: ['How to play', 'How to play', 'How to play', 'How to play', 'How to play, in six honest steps'],
    vi: 'Cách chơi',
  },
  'almanac.section.crops': {
    en: ['Crops', 'Crops', 'Every crop', 'Every crop in the valley', 'Every crop in the valley, with its real numbers'],
    vi: 'Mọi loại nông sản',
  },
  'almanac.section.tools': {
    en: ['Tools', 'Tools', 'Your tools', 'The seven things you can hold', 'The seven things you can hold, and what each one does'],
    vi: 'Dụng cụ của bạn',
  },
  'almanac.section.controls': {
    en: ['Controls', 'Controls', 'Controls', 'Every control', 'Every control, keyboard first'],
    vi: 'Điều khiển',
  },
  'almanac.section.seasons': {
    en: ['Seasons', 'Seasons', 'The four seasons', 'The four seasons', 'The four seasons, and what each one asks of you'],
    vi: 'Bốn mùa',
  },
  'almanac.section.weather': {
    en: ['Weather', 'Weather', 'Weather', 'The weather', 'The weather, and what it does to your soil'],
    vi: 'Thời tiết',
  },
  'almanac.section.quality': {
    en: ['Quality', 'Quality', 'Produce quality', 'Produce quality', 'Produce quality, and how to earn the good stuff'],
    vi: 'Chất lượng nông sản',
  },
  'almanac.section.energy': {
    en: ['Energy and time', 'Energy and time', 'Energy and time', 'Energy and time', 'Energy and time, the only two things you can run out of'],
    vi: 'Năng lượng và thời gian',
  },
  'almanac.section.money': {
    en: ['Money', 'Money', 'Money', 'Money', 'Money, and where it comes from'],
    vi: 'Tiền bạc',
  },
  'almanac.section.accessibility': {
    en: ['Accessibility', 'Accessibility', 'Accessibility', 'Accessibility', 'Accessibility, and how seriously we take it'],
    vi: 'Hỗ trợ tiếp cận',
  },
  'almanac.howto.1': {
    en: [
      'Clear the debris with the axe.',
      'Clear the debris with the axe.',
      'Start by clearing the weeds, rocks and logs with the axe.',
      'Start by clearing the weeds, rocks and logs. That is what the axe is for.',
      'Start by clearing the weeds, rocks and logs. The axe has been waiting years for this.',
    ],
    vi: 'Bắt đầu bằng việc dọn cỏ dại, đá và gỗ bằng rìu.',
  },
  'almanac.howto.2': {
    en: ['Till the ground with the hoe.', 'Till the ground with the hoe.', 'Turn the ground over with the hoe.', 'Turn the ground over with the hoe until it is dark and open.', 'Turn the ground over with the hoe until it is dark, open and breathing.'],
    vi: 'Lật đất lên bằng cuốc.',
  },
  'almanac.howto.3': {
    en: ['Sow a seed that suits the season.', 'Sow a seed that suits the season.', 'Sow a seed that likes this season.', 'Sow a seed that actually likes this season.', 'Sow a seed that actually likes this season, or watch it sulk and die.'],
    vi: 'Gieo một loại hạt hợp với mùa này.',
  },
  'almanac.howto.4': {
    en: ['Water it every day.', 'Water it every day.', 'Water it every single day.', 'Water it every single day. Plants keep score.', 'Water it every single day. Plants keep score, and they hold grudges.'],
    vi: 'Tưới nước mỗi ngày, không bỏ ngày nào.',
  },
  'almanac.howto.5': {
    en: ['Sleep to end the day.', 'Sleep to end the day.', 'Sleep to end the day and let things grow.', 'Sleep to end the day. Everything grows while you are out cold.', 'Sleep to end the day. The whole valley gets on with growing while you lie there snoring.'],
    vi: 'Đi ngủ để kết thúc ngày và để cây lớn lên.',
  },
  'almanac.howto.6': {
    en: ['Harvest, then sell at the shop.', 'Harvest, then sell at the shop.', 'Harvest what is ripe, then sell it at the shop.', 'Harvest what is ripe and sell it at the shop, and do it all again.', 'Harvest what is ripe, sell it at the shop, and begin the whole beautiful cycle again.'],
    vi: 'Thu hoạch những gì đã chín, rồi bán ở cửa hàng.',
  },
  'almanac.crops.column.name': {
    en: ['Crop', 'Crop', 'Crop', 'Crop', 'Crop'],
    vi: 'Nông sản',
  },
  'almanac.crops.column.season': {
    en: ['Season', 'Season', 'Season', 'Season', 'Season'],
    vi: 'Mùa',
  },
  'almanac.crops.column.seed': {
    en: ['Seed cost', 'Seed cost', 'Seed cost', 'What the seed costs', 'What the seed costs you'],
    vi: 'Giá hạt giống',
  },
  'almanac.crops.column.sell': {
    en: ['Sells for', 'Sells for', 'Sells for', 'What it sells for', 'What it sells for, at normal quality'],
    vi: 'Giá bán',
  },
  'almanac.crops.column.grow': {
    en: ['Growing days', 'Growing days', 'Days to grow', 'Days of watering to grow', 'Days of watering before it is ready'],
    vi: 'Số ngày lớn',
  },
  'almanac.crops.column.regrow': {
    en: ['Regrows', 'Regrows', 'Regrows in', 'Regrows in', 'Regrows in, if it regrows at all'],
    vi: 'Mọc lại sau',
  },
  'almanac.crops.column.yield': {
    en: ['Yield', 'Yield', 'Yield', 'How many you get', 'How many you get per picking'],
    vi: 'Sản lượng',
  },
  'almanac.crops.value.gold': {
    en: ['{gold}g', '{gold}g', '{gold}g', '{gold}g', '{gold}g'],
    vi: '{gold}g',
  },
  'almanac.crops.value.days': {
    en: ['{days} days', '{days} days', '{days} days', '{days} days', '{days} days'],
    vi: '{days} ngày',
  },
  'almanac.crops.value.yield': {
    en: ['{min} to {max}', '{min} to {max}', '{min} to {max}', '{min} to {max}', '{min} to {max}'],
    vi: '{min} đến {max}',
  },
  'almanac.crops.value.once': {
    en: ['Once only', 'Once only', 'One picking only', 'One picking and it is finished', 'One picking and it retires forever'],
    vi: 'Chỉ hái một lần',
  },
  'almanac.controls.column.input': {
    en: ['Key', 'Key', 'Key', 'Key', 'Key'],
    vi: 'Phím',
  },
  'almanac.controls.column.action': {
    en: ['What it does', 'What it does', 'What it does', 'What it does', 'What it does, exactly'],
    vi: 'Tác dụng',
  },
  'control.move': {
    en: ['Walk, and face that way', 'Walk, and face that way', 'Walk, and turn to face that way', 'Walk that way, and turn to face it', 'Walk that way, and turn to face it, even when the step is blocked'],
    vi: 'Đi bộ, và quay mặt về hướng đó',
  },
  'control.use': {
    en: ['Use the held tool on the faced tile', 'Use the held tool on the faced tile', 'Use whatever you are holding on the tile in front', 'Use whatever you are holding on the tile in front of you', 'Use whatever you are holding on the tile you are staring at'],
    vi: 'Dùng thứ bạn đang cầm lên ô ngay trước mặt',
  },
  'control.tool': {
    en: ['Pick a tool', 'Pick a tool', 'Pick a tool', 'Pick a tool from the belt', 'Pick a tool straight off the belt'],
    vi: 'Chọn một dụng cụ',
  },
  'control.seed': {
    en: ['Cycle the selected seed', 'Cycle the selected seed', 'Cycle through your seeds', 'Cycle through the seeds in your bag', 'Cycle through every seed rattling in your bag'],
    vi: 'Đổi qua lại giữa các loại hạt giống',
  },
  'control.shop': {
    en: ['Open the shop', 'Open the shop', 'Open the shop', 'Open the shop', 'Open the shop and spend recklessly'],
    vi: 'Mở cửa hàng',
  },
  'control.bag': {
    en: ['Open the bag', 'Open the bag', 'Open your bag', 'Open your bag', 'Open your bag and take stock'],
    vi: 'Mở túi đồ',
  },
  'control.sleep': {
    en: ['Sleep until morning', 'Sleep until morning', 'Sleep until morning', 'Sleep until morning', 'Sleep until morning, and let the valley get on with it'],
    vi: 'Ngủ cho đến sáng',
  },
  'control.help': {
    en: ['Open help', 'Open help', 'Open the help', 'Open the help', 'Open the help, there is no shame in it'],
    vi: 'Mở phần trợ giúp',
  },
  'control.mute': {
    en: ['Mute or unmute', 'Mute or unmute', 'Mute or unmute', 'Silence it, or bring it back', 'Silence it, or bring the whole valley back'],
    vi: 'Tắt hoặc bật tiếng',
  },
  'control.close': {
    en: ['Close the top panel', 'Close the top panel', 'Close the panel on top', 'Close whatever panel is on top', 'Close whatever panel is sitting on top'],
    vi: 'Đóng bảng đang ở trên cùng',
  },
  'almanac.accessibility.keyboard': {
    en: [
      'Every action is reachable from the keyboard. The mouse is optional.',
      'Every action is reachable from the keyboard. The mouse is optional.',
      'Every action is reachable from the keyboard — the mouse is entirely optional.',
      'Every action is reachable from the keyboard. The mouse is entirely optional, and always was.',
      'Every action is reachable from the keyboard. The mouse is entirely optional, and always was. Unplug it if you like.',
    ],
    vi: 'Mọi thao tác đều làm được bằng bàn phím — chuột hoàn toàn không bắt buộc.',
  },
  'almanac.accessibility.reader': {
    en: [
      'State changes are mirrored into a live region for screen readers.',
      'State changes are mirrored into a live region for screen readers.',
      'Anything that changes is mirrored into a live region so a screen reader hears it.',
      'Anything that changes is mirrored into a live region so a screen reader hears it too.',
      'Anything that changes is mirrored into a live region, so a screen reader hears every last thing.',
    ],
    vi: 'Mọi thay đổi đều được phản chiếu vào một vùng trực tiếp để trình đọc màn hình đọc lên.',
  },
  'almanac.accessibility.focus': {
    en: [
      'The cursor tile carries a pulsing outline. Position is never colour alone.',
      'The cursor tile carries a pulsing outline. Position is never shown by colour alone.',
      'The cursor tile carries a pulsing outline, so position is never shown by colour alone.',
      'The cursor tile wears a pulsing outline, so position is never shown by colour alone.',
      'The cursor tile wears a pulsing outline at all times, because position is never, ever shown by colour alone.',
    ],
    vi: 'Ô con trỏ có viền nhấp nháy, nên vị trí không bao giờ chỉ được thể hiện bằng màu sắc.',
  },
  'almanac.accessibility.contrast': {
    en: [
      'Text never sits on a background within {ratio} to 1 of it.',
      'Text never sits on a background within {ratio} to 1 of it.',
      'Text never sits on a background within {ratio} to 1 of its own colour.',
      'Text never sits on a background within {ratio} to 1 of its own colour. We checked every pair.',
      'Text never sits on a background within {ratio} to 1 of its own colour. We checked every single pair.',
    ],
    vi: 'Chữ không bao giờ nằm trên nền có độ tương phản với màu chữ thấp hơn {ratio} trên 1.',
  },
  'almanac.accessibility.motion': {
    en: [
      'The app honours reduced motion, in the game and in the shell.',
      'The app honours reduced motion, in the game and in the shell.',
      'Reduced motion is honoured everywhere — in the game and in the shell around it.',
      'Reduced motion is honoured everywhere, in the game and in the shell around it.',
      'Reduced motion is honoured everywhere, in the game and in the shell around it, without one sulky exception.',
    ],
    vi: 'Chế độ giảm chuyển động được tôn trọng ở mọi nơi — trong trò chơi lẫn trong giao diện bao quanh.',
  },
  'search.almanac.label': {
    en: ['Search the almanac', 'Search the almanac', 'Search the almanac', 'Hunt through the almanac', 'Interrogate every page of the almanac'],
    vi: 'Tìm trong niên giám',
  },
  'search.almanac.placeholder': {
    en: ['Search the almanac', 'Search the almanac', 'Search the almanac', 'What do you want to know?', 'Ask it anything about the valley'],
    vi: 'Tìm trong niên giám',
  },
  'search.crops.label': {
    en: ['Search crops', 'Search crops', 'Search every crop', 'Hunt through every crop', 'Interrogate all of the crops at once'],
    vi: 'Tìm mọi loại nông sản',
  },
  'search.crops.placeholder': {
    en: ['Search crops', 'Search crops', 'Search crops', 'Which crop?', 'Which crop are you after?'],
    vi: 'Tìm nông sản',
  },

  // =========================================================================
  // changelog
  // =========================================================================

  'changelog.title': {
    en: ['Changelog', 'Changelog', 'Changelog', 'The changelog', 'The changelog, in full'],
    vi: 'Nhật ký thay đổi',
  },
  'changelog.intro': {
    en: [
      'Bundled at build time. Nothing is fetched.',
      'Bundled at build time. Nothing is fetched.',
      'Bundled into the app at build time — nothing is fetched from anywhere.',
      'Bundled into the app at build time. Nothing is fetched from anywhere, ever.',
      'Bundled into the app at build time. Nothing is fetched from anywhere, ever, not even a comma.',
    ],
    vi: 'Được đóng gói vào ứng dụng lúc build — không có gì được tải từ bất kỳ đâu.',
  },
  'changelog.version': {
    en: ['Version {version}', 'Version {version}', 'Version {version}', 'Version {version}', 'Version {version}, for the record'],
    vi: 'Phiên bản {version}',
  },
  'changelog.released': {
    en: ['Released {date}', 'Released {date}', 'Released on {date}', 'Released on {date}', 'Released on {date}, to great acclaim'],
    vi: 'Phát hành ngày {date}',
  },
  'changelog.empty': {
    en: ['The changelog is empty.', 'The changelog is empty.', 'There is nothing in the changelog yet.', 'The changelog has nothing to say yet.', 'The changelog has nothing to say. Give it time.'],
    vi: 'Nhật ký thay đổi chưa có gì.',
  },
  'search.changelog.label': {
    en: ['Search the changelog', 'Search the changelog', 'Search the changelog', 'Hunt through the changelog', 'Interrogate every line of the changelog'],
    vi: 'Tìm trong nhật ký thay đổi',
  },
  'search.changelog.placeholder': {
    en: ['Search the changelog', 'Search the changelog', 'Search the changelog', 'What changed?', 'What exactly changed, and when?'],
    vi: 'Tìm trong nhật ký thay đổi',
  },

  // =========================================================================
  // history
  // =========================================================================

  'history.title': {
    en: ['History', 'History', 'History', 'Your history', 'Your history, kept honestly'],
    vi: 'Lịch sử',
  },
  'history.desc': {
    en: [
      'Local only, and bounded to {max} entries.',
      'Local only, and bounded to {max} entries.',
      'Kept on this computer only, and bounded to {max} entries.',
      'Kept on this computer only, bounded to {max} entries, oldest first out.',
      'Kept on this computer only, bounded to {max} entries, and the oldest is quietly shown the door.',
    ],
    vi: 'Chỉ lưu trên máy tính này, và giới hạn tối đa {max} mục.',
  },
  'history.empty': {
    en: ['Nothing has happened yet.', 'Nothing has happened yet.', 'Nothing has happened yet.', 'Nothing has happened yet. Go and do something.', 'Nothing has happened yet. Go on, do something worth recording.'],
    vi: 'Chưa có chuyện gì xảy ra cả.',
  },
  'history.count': {
    en: ['{count} of {total} entries', '{count} of {total} entries', '{count} of {total} entries', '{count} of {total} entries shown', '{count} of {total} entries, carefully selected'],
    vi: '{count} trên {total} mục',
  },
  'history.at': {
    en: ['{time}', '{time}', '{time}', '{time}', '{time}'],
    vi: '{time}',
  },
  'history.kind.action': {
    en: ['Farm action', 'Farm action', 'Farm action', 'Something you did on the farm', 'Something you did out on the farm'],
    vi: 'Thao tác trong trang trại',
  },
  'history.kind.purchase': {
    en: ['Purchase', 'Purchase', 'Purchase', 'Money going out', 'Money leaving your purse'],
    vi: 'Mua hàng',
  },
  'history.kind.sale': {
    en: ['Sale', 'Sale', 'Sale', 'Money coming in', 'Money arriving in your purse'],
    vi: 'Bán hàng',
  },
  'history.kind.day': {
    en: ['Day', 'Day', 'A day passing', 'A day passing', 'Another day gone by'],
    vi: 'Một ngày trôi qua',
  },
  'history.kind.setting': {
    en: ['Setting', 'Setting', 'Setting changed', 'A setting you changed', 'A setting you changed, for better or worse'],
    vi: 'Đổi cài đặt',
  },
  'history.kind.navigation': {
    en: ['Navigation', 'Navigation', 'Moving about', 'Moving about the app', 'Wandering about the app'],
    vi: 'Di chuyển',
  },
  'history.kind.export': {
    en: ['Export', 'Export', 'Export', 'Data taken out', 'Data packed up and taken out'],
    vi: 'Xuất dữ liệu',
  },
  'history.kind.error': {
    en: ['Error', 'Error', 'Something went wrong', 'Something went wrong', 'Something went badly wrong'],
    vi: 'Đã xảy ra lỗi',
  },
  'history.clear': {
    en: ['Clear the history', 'Clear the history', 'Clear the history', 'Wipe the history', 'Wipe the history and forget it all'],
    vi: 'Xóa lịch sử',
  },
  'history.clear.confirm.title': {
    en: ['Clear the history?', 'Clear the history?', 'Clear the history?', 'Really wipe the history?', 'Truly wipe every trace of the past?'],
    vi: 'Xóa lịch sử?',
  },
  'history.clear.confirm.body': {
    en: ['{count} entries will be deleted.', '{count} entries will be deleted.', '{count} entries will be deleted.', '{count} entries go in the bin.', '{count} entries go in the bin, never to be seen again.'],
    vi: '{count} mục sẽ bị xóa.',
  },
  'history.cleared': {
    en: ['Cleared {count} entries.', 'Cleared {count} entries.', 'Cleared {count} entries.', '{count} entries, gone.', '{count} entries, gone without a trace.'],
    vi: 'Đã xóa {count} mục.',
  },
  'history.filter.kind': {
    en: ['Filter by kind', 'Filter by kind', 'Filter by kind', 'Show one kind only', 'Show one kind only, and hide the rest'],
    vi: 'Lọc theo loại',
  },
  'history.filter.all': {
    en: ['All kinds', 'All kinds', 'Every kind', 'Every kind at once', 'Every kind at once, no filtering'],
    vi: 'Mọi loại',
  },
  'search.history.label': {
    en: ['Search the history', 'Search the history', 'Search your history', 'Hunt through your history', 'Interrogate every entry in your history'],
    vi: 'Tìm trong lịch sử của bạn',
  },
  'search.history.placeholder': {
    en: ['Search history', 'Search history', 'Search history', 'What are you looking for?', 'What are you trying to remember?'],
    vi: 'Tìm lịch sử',
  },

  // =========================================================================
  // export and import
  // =========================================================================

  'export.title': {
    en: ['Export', 'Export', 'Export', 'Export your data', 'Export your data, all of it'],
    vi: 'Xuất dữ liệu',
  },
  'export.format.json': {
    en: ['JSON', 'JSON', 'JSON', 'JSON, for machines', 'JSON, for machines and the curious'],
    vi: 'JSON',
  },
  'export.format.csv': {
    en: ['CSV', 'CSV', 'CSV', 'CSV, for spreadsheets', 'CSV, for spreadsheets and long evenings'],
    vi: 'CSV',
  },
  'export.format.markdown': {
    en: ['Markdown', 'Markdown', 'Markdown', 'Markdown, for reading', 'Markdown, for actual human reading'],
    vi: 'Markdown',
  },
  'export.target.save': {
    en: ['The farm save', 'The farm save', 'The farm save', 'The farm save', 'The farm save, the whole valley in one file'],
    vi: 'Bản lưu trang trại',
  },
  'export.target.settings': {
    en: ['Settings', 'Settings', 'Your settings', 'Your settings', 'Your settings, every last toggle'],
    vi: 'Cài đặt của bạn',
  },
  'export.target.appearance': {
    en: ['Appearance', 'Appearance', 'Your appearance changes', 'Your appearance changes', 'Your appearance changes, every restyled pixel'],
    vi: 'Các thay đổi giao diện của bạn',
  },
  'export.target.history': {
    en: ['History', 'History', 'Your history', 'Your history', 'Your history, warts and all'],
    vi: 'Lịch sử của bạn',
  },
  'export.target.all': {
    en: ['Everything', 'Everything', 'Everything', 'The whole lot', 'The whole lot, in one honest file'],
    vi: 'Tất cả mọi thứ',
  },
  'export.download': {
    en: ['Download', 'Download', 'Download it', 'Save it to a file', 'Save it to a file and keep it safe'],
    vi: 'Tải xuống',
  },
  'export.copy': {
    en: ['Copy to the clipboard', 'Copy to the clipboard', 'Copy it to the clipboard', 'Copy the whole thing', 'Copy the whole thing to your clipboard'],
    vi: 'Chép vào bộ nhớ tạm',
  },
  'export.size': {
    en: ['{bytes} bytes', '{bytes} bytes', '{bytes} bytes', '{bytes} bytes', '{bytes} bytes, not one more'],
    vi: '{bytes} byte',
  },
  'export.done': {
    en: ['Saved {filename}.', 'Saved {filename}.', 'Saved {filename}.', 'Saved as {filename}. Look after it.', 'Saved as {filename}. Guard it with your life.'],
    vi: 'Đã lưu {filename}.',
  },
  'export.failed': {
    en: ['Export failed: {error}', 'Export failed: {error}', 'The export did not work: {error}', 'The export fell over: {error}', 'The export fell over in spectacular fashion: {error}'],
    vi: 'Xuất dữ liệu không thành công: {error}',
  },
  'export.empty': {
    en: ['There is nothing to export.', 'There is nothing to export.', 'There is nothing here to export.', 'There is nothing here worth exporting.', 'There is nothing here worth exporting. Come back later.'],
    vi: 'Ở đây chưa có gì để xuất.',
  },
  'import.title': {
    en: ['Import', 'Import', 'Import', 'Import data', 'Import data from a file you trust'],
    vi: 'Nhập dữ liệu',
  },
  'import.paste': {
    en: ['Paste the exported text', 'Paste the exported text', 'Paste the exported text here', 'Paste what you exported earlier', 'Paste what you exported earlier, in full'],
    vi: 'Dán văn bản đã xuất vào đây',
  },
  'import.confirm.title': {
    en: ['Import and replace?', 'Import and replace?', 'Import and replace what is here?', 'Import this and replace what is here?', 'Import this and replace everything currently here?'],
    vi: 'Nhập vào và thay thế những gì đang có?',
  },
  'import.confirm.body': {
    en: ['{count} records will be replaced.', '{count} records will be replaced.', '{count} records will be replaced.', '{count} records get overwritten.', '{count} records get overwritten and there is no undo.'],
    vi: '{count} bản ghi sẽ bị thay thế.',
  },
  'import.done': {
    en: ['Imported {count} records.', 'Imported {count} records.', 'Imported {count} records.', '{count} records are in.', '{count} records have arrived safely.'],
    vi: 'Đã nhập {count} bản ghi.',
  },
  'import.invalid': {
    en: ['That file cannot be read: {error}', 'That file cannot be read: {error}', 'That file cannot be read: {error}', 'That file makes no sense: {error}', 'That file makes no sense whatsoever: {error}'],
    vi: 'Không đọc được tệp này: {error}',
  },

  // =========================================================================
  // the dim sum surprise
  // =========================================================================

  'surprise.title': {
    en: ['A small surprise', 'A small surprise', 'A small surprise', 'A small surprise', 'A small surprise, drawn by hand'],
    vi: 'Một điều bất ngờ nho nhỏ',
  },
  'surprise.enable': {
    en: ['Show the surprise', 'Show the surprise', 'Show me the surprise', 'Go on, show me', 'Go on then, show me the surprise'],
    vi: 'Cho tôi xem điều bất ngờ',
  },
  'surprise.disable': {
    en: ['Hide the surprise', 'Hide the surprise', 'Put the surprise away', 'Put the surprise away', 'Put the surprise away, for now'],
    vi: 'Cất điều bất ngờ đi',
  },
  'surprise.desc': {
    en: [
      'Every piece here is drawn as pixels. No photographs, and no network request.',
      'Every piece here is drawn as pixels. No photographs, and no network request.',
      'Every piece here is drawn as pixels — no photographs, and not one network request.',
      'Every piece here is drawn as pixels. No photographs, no downloads, not one network request.',
      'Every piece here is drawn as pixels, by hand. No photographs, no downloads, not one network request, not ever.',
    ],
    vi: 'Mọi thứ ở đây đều được vẽ bằng điểm ảnh — không có ảnh chụp nào, và không một yêu cầu mạng nào.',
  },
  'surprise.item.hargow': {
    en: ['Har gow', 'Har gow', 'Har gow', 'Har gow, four pleats and proud of it', 'Har gow, pleated four times because anything less is an insult'],
    vi: 'Há cảo',
  },
  'surprise.item.siumai': {
    en: ['Siu mai', 'Siu mai', 'Siu mai', 'Siu mai, topped and open', 'Siu mai, standing open-topped and utterly unbothered'],
    vi: 'Xíu mại',
  },
  'surprise.item.charsiubao': {
    en: ['Char siu bao', 'Char siu bao', 'Char siu bao', 'Char siu bao, split at the top', 'Char siu bao, split at the top and steaming quietly'],
    vi: 'Bánh bao xá xíu',
  },
  'surprise.item.cheungfun': {
    en: ['Cheung fun', 'Cheung fun', 'Cheung fun', 'Cheung fun, rolled and glossy', 'Cheung fun, rolled, glossy and swimming in sweet soy'],
    vi: 'Bánh cuốn kiểu Quảng',
  },
  'surprise.item.eggtart': {
    en: ['Egg tart', 'Egg tart', 'Egg tart', 'Egg tart, still warm', 'Egg tart, still warm, and worth burning your mouth for'],
    vi: 'Bánh tart trứng',
  },

  // =========================================================================
  // names — these ARE facts, so they read identically at every level
  // =========================================================================

  'crop.parsnip': {
    en: ['Parsnip', 'Parsnip', 'Parsnip', 'Parsnip', 'Parsnip'],
    vi: 'Củ cải vàng',
  },
  'crop.tulip': {
    en: ['Tulip', 'Tulip', 'Tulip', 'Tulip', 'Tulip'],
    vi: 'Hoa tulip',
  },
  'crop.cabbage': {
    en: ['Cabbage', 'Cabbage', 'Cabbage', 'Cabbage', 'Cabbage'],
    vi: 'Bắp cải',
  },
  'crop.strawberry': {
    en: ['Strawberry', 'Strawberry', 'Strawberry', 'Strawberry', 'Strawberry'],
    vi: 'Dâu tây',
  },
  'crop.pepper': {
    en: ['Pepper', 'Pepper', 'Pepper', 'Pepper', 'Pepper'],
    vi: 'Ớt',
  },
  'crop.tomato': {
    en: ['Tomato', 'Tomato', 'Tomato', 'Tomato', 'Tomato'],
    vi: 'Cà chua',
  },
  'crop.corn': {
    en: ['Corn', 'Corn', 'Corn', 'Corn', 'Corn'],
    vi: 'Ngô',
  },
  'crop.melon': {
    en: ['Melon', 'Melon', 'Melon', 'Melon', 'Melon'],
    vi: 'Dưa lưới',
  },
  'crop.barley': {
    en: ['Barley', 'Barley', 'Barley', 'Barley', 'Barley'],
    vi: 'Lúa mạch',
  },
  'crop.beet': {
    en: ['Beet', 'Beet', 'Beet', 'Beet', 'Beet'],
    vi: 'Củ dền',
  },
  'crop.grape': {
    en: ['Grape', 'Grape', 'Grape', 'Grape', 'Grape'],
    vi: 'Nho',
  },
  'crop.pumpkin': {
    en: ['Pumpkin', 'Pumpkin', 'Pumpkin', 'Pumpkin', 'Pumpkin'],
    vi: 'Bí ngô',
  },
  'crop.snowdrop': {
    en: ['Snowdrop', 'Snowdrop', 'Snowdrop', 'Snowdrop', 'Snowdrop'],
    vi: 'Hoa giọt tuyết',
  },
  'crop.winterroot': {
    en: ['Winterroot', 'Winterroot', 'Winterroot', 'Winterroot', 'Winterroot'],
    vi: 'Rễ mùa đông',
  },
  'crop.frostcap': {
    en: ['Frostcap', 'Frostcap', 'Frostcap', 'Frostcap', 'Frostcap'],
    vi: 'Nấm sương giá',
  },
  'crop.unknown': {
    en: ['Unknown crop', 'Unknown crop', 'Unknown crop', 'Unknown crop', 'Unknown crop'],
    vi: 'Nông sản lạ',
  },
  'season.spring': {
    en: ['Spring', 'Spring', 'Spring', 'Spring', 'Spring'],
    vi: 'Xuân',
  },
  'season.summer': {
    en: ['Summer', 'Summer', 'Summer', 'Summer', 'Summer'],
    vi: 'Hạ',
  },
  'season.fall': {
    en: ['Fall', 'Fall', 'Fall', 'Fall', 'Fall'],
    vi: 'Thu',
  },
  'season.winter': {
    en: ['Winter', 'Winter', 'Winter', 'Winter', 'Winter'],
    vi: 'Đông',
  },
  'weather.clear': {
    en: ['Clear', 'Clear', 'Clear', 'Clear', 'Clear'],
    vi: 'Trời quang',
  },
  'weather.rain': {
    en: ['Rain', 'Rain', 'Rain', 'Rain', 'Rain'],
    vi: 'Mưa',
  },
  'weather.storm': {
    en: ['Storm', 'Storm', 'Storm', 'Storm', 'Storm'],
    vi: 'Bão',
  },
  'weather.snow': {
    en: ['Snow', 'Snow', 'Snow', 'Snow', 'Snow'],
    vi: 'Tuyết',
  },
  'quality.normal': {
    en: ['Normal', 'Normal', 'Normal', 'Normal', 'Normal'],
    vi: 'Thường',
  },
  'quality.silver': {
    en: ['Silver', 'Silver', 'Silver', 'Silver', 'Silver'],
    vi: 'Bạc',
  },
  'quality.gold': {
    en: ['Gold', 'Gold', 'Gold', 'Gold', 'Gold'],
    vi: 'Vàng',
  },
  'tool.hoe': {
    en: ['Hoe', 'Hoe', 'Hoe', 'Hoe', 'Hoe'],
    vi: 'Cuốc',
  },
  'tool.can': {
    en: ['Watering can', 'Watering can', 'Watering can', 'Watering can', 'Watering can'],
    vi: 'Bình tưới',
  },
  'tool.seeds': {
    en: ['Seeds', 'Seeds', 'Seeds', 'Seeds', 'Seeds'],
    vi: 'Hạt giống',
  },
  'tool.hand': {
    en: ['Hand', 'Hand', 'Hand', 'Hand', 'Hand'],
    vi: 'Tay không',
  },
  'tool.axe': {
    en: ['Axe', 'Axe', 'Axe', 'Axe', 'Axe'],
    vi: 'Rìu',
  },
  'tool.sprinkler': {
    en: ['Sprinkler', 'Sprinkler', 'Sprinkler', 'Sprinkler', 'Sprinkler'],
    vi: 'Vòi phun nước',
  },
  'tool.fertilizer': {
    en: ['Fertilizer', 'Fertilizer', 'Fertilizer', 'Fertilizer', 'Fertilizer'],
    vi: 'Phân bón',
  },
  'tool.hoe.desc': {
    en: ['Turns grass into soil.', 'Turns grass into soil.', 'Turns plain grass into workable soil.', 'Turns plain grass into soil worth sowing.', 'Turns idle grass into dark, open, sowable soil.'],
    vi: 'Biến đất cỏ thường thành đất có thể canh tác.',
  },
  'tool.can.desc': {
    en: ['Waters tilled soil.', 'Waters tilled soil.', 'Waters tilled soil, as far as it reaches.', 'Waters tilled soil, as far as its reach goes.', 'Waters every tilled tile it can reach, and looks good doing it.'],
    vi: 'Tưới nước cho đất đã cuốc, trong tầm với của nó.',
  },
  'tool.seeds.desc': {
    en: ['Sows the selected seed.', 'Sows the selected seed.', 'Sows whichever seed you have selected.', 'Sows whichever seed you have picked out.', 'Sows whichever seed you have picked out, and hopes for the best.'],
    vi: 'Gieo loại hạt giống bạn đang chọn.',
  },
  'tool.hand.desc': {
    en: ['Picks ripe crops.', 'Picks ripe crops.', 'Picks anything that is ripe.', 'Picks anything ripe, and pulls up anything dead.', 'Picks anything ripe, and hauls up anything that gave up and died.'],
    vi: 'Hái bất cứ thứ gì đã chín.',
  },
  'tool.axe.desc': {
    en: ['Clears weeds, rocks and logs.', 'Clears weeds, rocks and logs.', 'Clears weeds, rocks and logs off the ground.', 'Clears weeds, rocks and logs, at a price in energy.', 'Clears weeds, rocks and logs — and charges your back for the privilege.'],
    vi: 'Dọn cỏ dại, đá và gỗ khỏi mặt đất.',
  },
  'tool.sprinkler.desc': {
    en: ['Waters its neighbours each night.', 'Waters its neighbours each night.', 'Waters the tiles around it every night.', 'Waters the tiles around it every night, while you sleep.', 'Waters the tiles around it every night while you snore, asking nothing in return.'],
    vi: 'Tưới nước cho các ô xung quanh mỗi đêm.',
  },
  'tool.fertilizer.desc': {
    en: ['Enriches tilled soil before sowing.', 'Enriches tilled soil before sowing.', 'Enriches tilled soil, before anything is sown in it.', 'Enriches tilled soil before you sow — faster growth, better quality.', 'Enriches tilled soil before you sow: faster growth, better quality, smugger farmer.'],
    vi: 'Làm giàu cho đất đã cuốc, trước khi gieo gì vào đó.',
  },
  'good.sprinkler': {
    en: ['Sprinkler', 'Sprinkler', 'Sprinkler', 'Sprinkler', 'Sprinkler'],
    vi: 'Vòi phun nước',
  },
  'good.fertilizer': {
    en: ['Fertilizer', 'Fertilizer', 'Fertilizer', 'Fertilizer', 'Fertilizer'],
    vi: 'Phân bón',
  },
  'ground.grass': {
    en: ['Grass', 'Grass', 'Grass', 'Grass', 'Grass'],
    vi: 'Cỏ',
  },
  'ground.soil': {
    en: ['Tilled soil', 'Tilled soil', 'Tilled soil', 'Tilled soil', 'Tilled soil'],
    vi: 'Đất đã cuốc',
  },
  'ground.weeds': {
    en: ['Weeds', 'Weeds', 'Weeds', 'Weeds', 'Weeds'],
    vi: 'Cỏ dại',
  },
  'ground.rock': {
    en: ['Rock', 'Rock', 'Rock', 'Rock', 'Rock'],
    vi: 'Đá',
  },
  'ground.log': {
    en: ['Log', 'Log', 'Log', 'Log', 'Log'],
    vi: 'Khúc gỗ',
  },
  'ground.water': {
    en: ['Pond', 'Pond', 'Pond', 'Pond', 'Pond'],
    vi: 'Ao',
  },
  'ground.path': {
    en: ['Path', 'Path', 'Path', 'Path', 'Path'],
    vi: 'Lối đi',
  },
  'item.seed': {
    en: ['{crop} seeds', '{crop} seeds', '{crop} seeds', '{crop} seeds', '{crop} seeds'],
    vi: 'Hạt giống {crop}',
  },
  'item.produce': {
    en: ['{crop}', '{crop}', '{crop}', '{crop}', '{crop}'],
    vi: '{crop}',
  },
  'item.produce.quality': {
    en: ['{quality} {crop}', '{quality} {crop}', '{quality} {crop}', '{quality} {crop}', '{quality} {crop}'],
    vi: '{crop} {quality}',
  },
  'label.gold': {
    en: ['{gold}g', '{gold}g', '{gold}g', '{gold}g', '{gold}g'],
    vi: '{gold}g',
  },
  'label.energy': {
    en: ['Energy {energy} of {max}', 'Energy {energy} of {max}', 'Energy {energy} of {max}', 'Energy {energy} of {max}', 'Energy {energy} of {max}'],
    vi: 'Năng lượng {energy} trên {max}',
  },
  'label.date': {
    en: ['{season} {day}, year {year}', '{season} {day}, year {year}', '{season} {day}, year {year}', '{season} {day}, year {year}', '{season} {day}, year {year}'],
    vi: 'Ngày {day} mùa {season}, năm {year}',
  },
  'label.time': {
    en: ['{time}', '{time}', '{time}', '{time}', '{time}'],
    vi: '{time}',
  },
  'label.count': {
    en: ['{count} × {item}', '{count} × {item}', '{count} × {item}', '{count} × {item}', '{count} × {item}'],
    vi: '{count} × {item}',
  },

  // =========================================================================
  // game messages — every message src/game/actions.ts returns
  // =========================================================================

  'game.guard.exhausted': {
    en: [
      'You cannot act. Go to bed.',
      'You can barely stand. Go to bed.',
      'You can barely stand. Get yourself to bed.',
      'You can barely stand up. Bed. Now.',
      'You are swaying like a scarecrow in a gale. Bed. Immediately.',
    ],
    vi: 'Bạn gần như không đứng nổi nữa. Về giường ngủ đi.',
  },
  'game.guard.offMap': {
    en: [
      'There is nothing there.',
      'There is nothing over there.',
      'There is nothing over there.',
      'There is nothing over there at all.',
      'There is nothing over there. Not a thing. You are gesturing at the void.',
    ],
    vi: 'Bên đó chẳng có gì cả.',
  },
  'game.guard.tired': {
    en: [
      'You do not have the energy.',
      'You are too tired for that.',
      'You are too tired for that.',
      'You are far too tired for that.',
      'You are far too tired for that, and your arms have filed a complaint.',
    ],
    vi: 'Bạn mệt quá, không làm được việc đó.',
  },
  'game.debris.weeds': {
    en: ['weeds', 'weeds', 'weeds', 'weeds', 'weeds'],
    vi: 'cỏ dại',
  },
  'game.debris.rock': {
    en: ['rock', 'rock', 'rock', 'rock', 'rock'],
    vi: 'đá',
  },
  'game.debris.log': {
    en: ['log', 'log', 'log', 'log', 'log'],
    vi: 'khúc gỗ',
  },
  'game.debris.other': {
    en: ['debris', 'debris', 'debris', 'debris', 'debris'],
    vi: 'đống đổ nát',
  },
  'game.clear.first': {
    en: [
      'Clear the {debris} first.',
      'Clear the {debris} first.',
      'Clear the {debris} out of the way first.',
      'Clear the {debris} first — it is in the way.',
      'Clear the {debris} first. It is standing there like it pays rent.',
    ],
    vi: 'Hãy dọn {debris} đang chắn đường trước đã.',
  },
  'game.clear.nothing': {
    en: [
      'There is nothing to clear there.',
      'There is nothing to clear there.',
      'There is nothing to clear there.',
      'There is nothing there to clear.',
      'There is nothing there to clear. You are swinging at fresh air.',
    ],
    vi: 'Ở đó không có gì để dọn.',
  },
  'game.clear.weeds': {
    en: [
      'The weeds are cleared.',
      'The weeds come up easily.',
      'The weeds come up easily.',
      'The weeds come up without a fight.',
      'The weeds come up without a fight, which is frankly disappointing.',
    ],
    vi: 'Cỏ dại nhổ lên dễ dàng.',
  },
  'game.clear.rock': {
    en: [
      'The rock is broken up.',
      'The rock breaks apart.',
      'The rock breaks apart.',
      'The rock gives up and breaks apart.',
      'The rock holds out for one proud second, then breaks apart.',
    ],
    vi: 'Hòn đá vỡ tan.',
  },
  'game.clear.log': {
    en: [
      'The log is split and hauled off.',
      'The log splits and is hauled off.',
      'The log splits and is hauled off.',
      'The log splits with a crack and is hauled off.',
      'The log splits with a crack that echoes down the valley, then is hauled off.',
    ],
    vi: 'Khúc gỗ bị chẻ ra rồi chở đi.',
  },
  'game.till.already': {
    en: ['This soil is already turned.', 'This soil is already turned.', 'This soil is already turned over.', 'This soil is already turned. Twice is not better.', 'This soil is already turned. Turning it twice impresses nobody.'],
    vi: 'Miếng đất này đã được cuốc rồi.',
  },
  'game.till.pond': {
    en: ['You cannot till the pond.', 'You cannot till the pond.', 'You cannot till the pond.', 'You cannot till a pond, no matter how you feel about it.', 'You cannot till a pond. Water has been refusing hoes since the dawn of time.'],
    vi: 'Bạn không thể cuốc cái ao.',
  },
  'game.till.path': {
    en: ['The path is packed too hard.', 'The path is packed too hard.', 'The path is packed far too hard.', 'The path is packed far too hard for that.', 'The path is packed harder than your resolve. It wins.'],
    vi: 'Lối đi bị nén cứng quá, không cuốc được.',
  },
  'game.till.ok': {
    en: [
      'The soil is turned.',
      'The earth turns over.',
      'The earth turns over, dark and ready.',
      'The earth rolls over, dark and ready for a seed.',
      'The earth rolls over and shows its dark belly, ready and waiting for a seed.',
    ],
    vi: 'Đất được lật lên, tơi xốp và sẵn sàng.',
  },
  'game.water.noSoil': {
    en: ['There is no tilled soil to water.', 'There is no tilled soil to water.', 'There is no tilled soil here to water.', 'There is no tilled soil here to water at all.', 'There is no tilled soil here. You are watering the concept of gardening.'],
    vi: 'Ở đây không có đất đã cuốc để tưới.',
  },
  'game.water.already': {
    en: ['This soil is already watered.', 'This soil is already watered.', 'This soil is already watered.', 'This soil is already watered. It is quite full.', 'This soil is already watered. It is full, thank you, and slightly embarrassed.'],
    vi: 'Miếng đất này đã được tưới rồi.',
  },
  'game.water.ok': {
    en: ['The soil is watered.', 'The soil drinks it up.', 'The soil drinks it up.', 'The soil drinks it up greedily.', 'The soil drinks it up like it has been waiting all week for that.'],
    vi: 'Đất hút nước no nê.',
  },
  'game.water.many': {
    en: ['Watered {count} tiles.', 'Watered {count} tiles.', 'Watered {count} tiles in one go.', 'Watered {count} tiles in one sweep. Efficient.', 'Watered {count} tiles in a single glorious sweep. The can is thrilled.'],
    vi: 'Đã tưới {count} ô chỉ trong một lần.',
  },
  'game.sow.noSuchSeed': {
    en: ['You have no such seed.', 'You have no such seed.', 'You have no such seed.', 'You have no such seed on you.', 'You have no such seed. You checked twice. It is not there.'],
    vi: 'Bạn không có loại hạt giống đó.',
  },
  'game.sow.tillFirst': {
    en: ['Till the ground first.', 'Till the ground first.', 'Till the ground first.', 'Till the ground first — seeds are fussy.', 'Till the ground first. Seeds are fussy and they will not settle for grass.'],
    vi: 'Hãy cuốc đất trước đã.',
  },
  'game.sow.badGround': {
    en: ['Seeds will not take there.', 'Seeds will not take there.', 'Seeds will not take there.', 'Seeds will not take there, however you plant them.', 'Seeds will not take there, and no amount of encouragement will change that.'],
    vi: 'Hạt giống không mọc được ở đó.',
  },
  'game.sow.occupied': {
    en: ['Something is already growing here.', 'Something is already growing here.', 'Something is already growing here.', 'Something is already growing here, thank you.', 'Something is already growing here and it was here first.'],
    vi: 'Ở đây đã có thứ gì đó đang mọc.',
  },
  'game.sow.noSeeds': {
    en: ['No {crop} seeds in the bag.', 'No {crop} seeds in the bag.', 'No {crop} seeds in the bag.', 'Not one {crop} seed in the bag.', 'Not one {crop} seed in the bag. The bag is quite sure.'],
    vi: 'Trong túi không có hạt giống {crop} nào.',
  },
  'game.sow.outOfSeason': {
    en: [
      '{crop} will not grow in {season}.',
      '{crop} will not grow in {season}.',
      '{crop} will not grow in {season}.',
      '{crop} refuses to grow in {season}.',
      '{crop} flatly refuses to grow in {season}, and it will not be argued with.',
    ],
    vi: '{crop} không mọc được vào mùa {season}.',
  },
  'game.sow.ok': {
    en: ['{crop} sown.', '{crop} sown.', '{crop} is in the ground.', '{crop} is in the ground. Now leave it alone.', '{crop} is in the ground and already plotting its future.'],
    vi: '{crop} đã được gieo xuống đất.',
  },
  'game.harvest.useAxe': {
    en: ['Use the axe on the {debris}.', 'Use the axe on the {debris}.', 'Use the axe on the {debris}.', 'That is a job for the axe — the {debris} is in the way.', 'Hands are no use here. The {debris} wants the axe, and it wants it now.'],
    vi: 'Hãy dùng rìu với {debris}.',
  },
  'game.harvest.nothing': {
    en: ['There is nothing to pick here.', 'There is nothing to pick here.', 'There is nothing to pick here.', 'There is nothing here worth picking.', 'There is nothing here to pick. Your hand closes on air.'],
    vi: 'Ở đây không có gì để hái.',
  },
  'game.harvest.notReady': {
    en: ['The {crop} is not ready yet.', 'The {crop} is not ready yet.', 'The {crop} is not ready yet.', 'The {crop} is not ready yet. Patience.', 'The {crop} is not ready yet, and staring at it will not help.'],
    vi: '{crop} chưa chín.',
  },
  'game.harvest.withered': {
    en: [
      'You pull up the withered {crop}.',
      'You pull up the withered {crop}.',
      'You pull up the withered {crop}.',
      'You pull up the withered {crop}. It happens.',
      'You pull up the withered {crop} and hold a short, dignified funeral.',
    ],
    vi: 'Bạn nhổ {crop} đã héo lên.',
  },
  'game.harvest.ok': {
    en: ['Picked {count} {crop}.', 'Picked {count} {crop}.', 'Picked {count} {crop}.', 'Picked {count} {crop}. Not bad at all.', 'Picked {count} {crop}. The bag grows heavy and you grow proud.'],
    vi: 'Đã hái {count} {crop}.',
  },
  'game.harvest.okQuality': {
    en: [
      'Picked {count} {crop}, {quality} quality.',
      'Picked {count} {crop}, {quality} quality.',
      'Picked {count} {crop} — {quality} quality, no less.',
      'Picked {count} {crop} at {quality} quality. Look at you.',
      'Picked {count} {crop} at {quality} quality. Somewhere, a judge is weeping.',
    ],
    vi: 'Đã hái {count} {crop} — chất lượng {quality}, không kém chút nào.',
  },
  'game.harvest.okRegrow': {
    en: [
      'Picked {count} {crop}. It will bear again.',
      'Picked {count} {crop}. It will bear again.',
      'Picked {count} {crop}, and it will bear again.',
      'Picked {count} {crop}, and it is already planning the next batch.',
      'Picked {count} {crop}, and the plant is already planning its next performance.',
    ],
    vi: 'Đã hái {count} {crop}, và nó sẽ ra quả lần nữa.',
  },
  'game.harvest.okQualityRegrow': {
    en: [
      'Picked {count} {crop}, {quality} quality. It will bear again.',
      'Picked {count} {crop}, {quality} quality. It will bear again.',
      'Picked {count} {crop} at {quality} quality, and it will bear again.',
      'Picked {count} {crop} at {quality} quality, and it is already planning the next batch.',
      'Picked {count} {crop} at {quality} quality, and the plant is already planning an encore.',
    ],
    vi: 'Đã hái {count} {crop} chất lượng {quality}, và nó sẽ ra quả lần nữa.',
  },
  'game.sprinkler.none': {
    en: ['No sprinklers in the bag.', 'No sprinklers in the bag.', 'No sprinklers in the bag.', 'Not one sprinkler in the bag.', 'Not one sprinkler in the bag. They are four hundred gold each, after all.'],
    vi: 'Trong túi không có vòi phun nước nào.',
  },
  'game.sprinkler.already': {
    en: ['A sprinkler already stands here.', 'A sprinkler already stands here.', 'A sprinkler already stands here.', 'A sprinkler already stands here, doing its job.', 'A sprinkler already stands here, doing its job, and it does not want a colleague.'],
    vi: 'Ở đây đã có một vòi phun nước.',
  },
  'game.sprinkler.pond': {
    en: ['It would sink in the pond.', 'It would sink in the pond.', 'It would sink straight into the pond.', 'It would sink straight into the pond, which defeats the purpose.', 'It would sink straight into the pond, where it would water fish. Fish do not need watering.'],
    vi: 'Nó sẽ chìm thẳng xuống ao mất.',
  },
  'game.sprinkler.occupied': {
    en: ['Something is growing there already.', 'Something is growing there already.', 'Something is growing there already.', 'Something is growing there already — find another tile.', 'Something is growing there already. Find it another home.'],
    vi: 'Ở đó đã có thứ gì đó đang mọc.',
  },
  'game.sprinkler.ok': {
    en: [
      'The sprinkler will water its neighbours.',
      'The sprinkler will water its neighbours.',
      'The sprinkler will water its neighbours every night.',
      'The sprinkler will water its neighbours every night while you sleep.',
      'The sprinkler takes its post and will water its neighbours nightly, forever, without complaint.',
    ],
    vi: 'Vòi phun nước sẽ tưới cho các ô lân cận mỗi đêm.',
  },
  'game.fertilize.none': {
    en: ['No fertilizer in the bag.', 'No fertilizer in the bag.', 'No fertilizer in the bag.', 'Not a scrap of fertilizer in the bag.', 'Not a scrap of fertilizer in the bag. The shop would love to help.'],
    vi: 'Trong túi không có phân bón.',
  },
  'game.fertilize.needSoil': {
    en: ['Fertilizer only helps tilled soil.', 'Fertilizer only helps tilled soil.', 'Fertilizer only helps tilled soil.', 'Fertilizer only helps tilled soil. Turn it over first.', 'Fertilizer only helps tilled soil. Grass is beyond even its powers.'],
    vi: 'Phân bón chỉ có ích với đất đã cuốc.',
  },
  'game.fertilize.beforeSow': {
    en: ['Feed the soil before you sow it.', 'Feed the soil before you sow it.', 'Feed the soil before you sow it.', 'Feed the soil before you sow it, not after.', 'Feed the soil before you sow it. Afterwards is far too late, as usual.'],
    vi: 'Hãy bón đất trước khi gieo hạt.',
  },
  'game.fertilize.already': {
    en: ['This soil is already rich.', 'This soil is already rich.', 'This soil is already rich.', 'This soil is already rich enough.', 'This soil is already rich enough to retire on.'],
    vi: 'Miếng đất này đã màu mỡ rồi.',
  },
  'game.fertilize.ok': {
    en: ['The soil is dark and rich.', 'The soil is dark and rich.', 'The soil turns dark and rich.', 'The soil turns dark and rich. Something good will come of this.', 'The soil turns dark and rich as chocolate cake. Great things are coming.'],
    vi: 'Đất trở nên sẫm màu và màu mỡ.',
  },
  'game.tool.pickSeed': {
    en: [
      'Select a seed first with {keys}.',
      'Pick a seed first with {keys}.',
      'Pick a seed first — press {keys}.',
      'Pick a seed first. That is what {keys} is for.',
      'Pick a seed first. Press {keys}, unless you meant to plant your own optimism.',
    ],
    vi: 'Hãy chọn một hạt giống trước — bấm {keys}.',
  },
  'game.tool.nothing': {
    en: ['Nothing happens.', 'Nothing happens.', 'Nothing happens.', 'Nothing happens at all.', 'Nothing happens. Somewhere, a cricket coughs.'],
    vi: 'Chẳng có chuyện gì xảy ra.',
  },

  // ---- the sleep report ---------------------------------------------------

  'game.day.title': {
    en: ['{date}', '{date}', '{date}', '{date}', '{date}'],
    vi: '{date}',
  },
  'game.day.weather': {
    en: ['Overnight: {weather}.', 'Overnight: {weather}.', 'Overnight it was {weather}.', 'Overnight it was {weather}.', 'The night brought {weather}, and the valley took it as it came.'],
    vi: 'Đêm qua trời {weather}.',
  },
  'game.day.forecast': {
    en: ['Tomorrow: {weather}.', 'Tomorrow: {weather}.', 'Tomorrow looks like {weather}.', 'Tomorrow is shaping up to be {weather}.', 'Tomorrow, if the sky is to be believed, will be {weather}.'],
    vi: 'Ngày mai trời có vẻ sẽ {weather}.',
  },
  'game.day.watered': {
    en: ['{count} tiles were watered.', '{count} tiles were watered.', '{count} tiles were watered.', '{count} tiles went to bed wet.', '{count} tiles went to bed properly soaked, and slept well.'],
    vi: '{count} ô đã được tưới nước.',
  },
  'game.day.grew': {
    en: ['{count} plants grew.', '{count} plants grew.', '{count} plants put on some growth.', '{count} plants put on some growth overnight.', '{count} plants stretched, yawned and grew a little in the night.'],
    vi: '{count} cây đã lớn thêm một chút.',
  },
  'game.day.ripened': {
    en: ['{count} are ready to pick.', '{count} are ready to pick.', '{count} are ripe and ready to pick.', '{count} are ripe and waiting for you.', '{count} are ripe, gleaming, and waiting for you to notice.'],
    vi: '{count} cây đã chín và sẵn sàng để hái.',
  },
  'game.day.withered': {
    en: ['{count} withered.', '{count} withered.', '{count} withered from thirst.', '{count} withered from thirst. Water them tomorrow.', '{count} withered from thirst overnight. They died believing in you.'],
    vi: '{count} cây đã héo vì khát.',
  },
  'game.day.outOfSeason': {
    en: [
      '{count} crops could not survive the change of season.',
      '{count} crops could not survive the change of season.',
      '{count} crops could not survive the change of season.',
      '{count} crops could not survive the turn of the season and were cleared.',
      '{count} crops could not survive the turn of the season. The calendar shows no mercy.',
    ],
    vi: '{count} cây không sống nổi qua lúc chuyển mùa.',
  },
  'game.day.seasonChanged': {
    en: ['{season} has begun.', '{season} has begun.', '{season} has begun.', '{season} has arrived. Everything changes.', '{season} sweeps into the valley and changes absolutely everything.'],
    vi: 'Mùa {season} đã bắt đầu.',
  },
  'game.day.passedOut': {
    en: [
      'You passed out and were carried home. {gold}g was taken for the trouble.',
      'You passed out and were carried home. {gold}g was taken for the trouble.',
      'You passed out and someone carried you home. It cost you {gold}g.',
      'You passed out and someone carried you home, then charged you {gold}g for it.',
      'You keeled over in the dirt and were carried home like a sack of parsnips. The bill came to {gold}g.',
    ],
    vi: 'Bạn ngất đi và có người khiêng bạn về nhà. Tốn của bạn {gold}g.',
  },
  'game.day.quiet': {
    en: ['Nothing much happened.', 'Nothing much happened overnight.', 'A quiet night. Nothing much happened.', 'A quiet night. Nothing much happened at all.', 'A quiet night. Nothing happened, and that is its own kind of blessing.'],
    vi: 'Một đêm yên ả. Chẳng có chuyện gì đáng kể.',
  },

  // =========================================================================
  // shop messages — every message src/game/shop.ts returns
  // =========================================================================

  'shop.buy.atLeastOne': {
    en: ['Buy at least one.', 'Buy at least one.', 'Buy at least one.', 'Buy at least one, or buy none at all.', 'Buy at least one. Buying zero of something is a philosophy, not a purchase.'],
    vi: 'Hãy mua ít nhất một cái.',
  },
  'shop.buy.notSold': {
    en: [
      '{item} is not sold this season.',
      '{item} is not sold this season.',
      '{item} is not sold this season.',
      '{item} is not sold this season. Come back later.',
      '{item} is not sold this season. The shopkeeper shrugs at the calendar.',
    ],
    vi: '{item} không được bán trong mùa này.',
  },
  'shop.buy.stock': {
    en: ['Only {count} left in stock.', 'Only {count} left in stock.', 'Only {count} left in stock.', 'Only {count} left in stock, sorry.', 'Only {count} left in stock, and the shelf looks rather sad about it.'],
    vi: 'Chỉ còn {count} trong kho.',
  },
  'shop.buy.cannotAfford': {
    en: [
      'That costs {cost}g and you have {gold}g.',
      'That costs {cost}g and you have {gold}g.',
      'That costs {cost}g, and you have {gold}g.',
      'That costs {cost}g. You have {gold}g. The arithmetic is not kind.',
      'That costs {cost}g. You have {gold}g. The arithmetic is merciless and the shopkeeper is watching.',
    ],
    vi: 'Cái đó giá {cost}g, mà bạn chỉ có {gold}g.',
  },
  'shop.buy.ok': {
    en: [
      'Bought {count} {item} for {cost}g.',
      'Bought {count} {item} for {cost}g.',
      'Bought {count} {item} for {cost}g.',
      'Bought {count} {item} for {cost}g. Spend it well.',
      'Bought {count} {item} for {cost}g. The coins clink, the shopkeeper beams.',
    ],
    vi: 'Đã mua {count} {item} với giá {cost}g.',
  },
  'shop.sell.atLeastOne': {
    en: ['Sell at least one.', 'Sell at least one.', 'Sell at least one.', 'Sell at least one, or sell none at all.', 'Sell at least one. Selling zero is not a transaction, it is a conversation.'],
    vi: 'Hãy bán ít nhất một cái.',
  },
  'shop.sell.none': {
    en: ['No {item} in the bag.', 'No {item} in the bag.', 'No {item} in the bag.', 'Not one {item} in the bag.', 'Not one {item} in the bag. You may have imagined it.'],
    vi: 'Trong túi không có {item} nào.',
  },
  'shop.sell.only': {
    en: ['Only {count} in the bag.', 'Only {count} in the bag.', 'Only {count} in the bag.', 'Only {count} in the bag, I am afraid.', 'Only {count} in the bag. The bag has been thoroughly searched.'],
    vi: 'Trong túi chỉ có {count}.',
  },
  'shop.sell.worthless': {
    en: ['Nobody wants {item}.', 'Nobody wants {item}.', 'Nobody wants {item}.', 'Nobody wants {item}, sadly.', 'Nobody wants {item}. Not one soul in the whole valley.'],
    vi: 'Không ai muốn mua {item}.',
  },
  'shop.sell.ok': {
    en: [
      'Sold {count} {item} for {total}g.',
      'Sold {count} {item} for {total}g.',
      'Sold {count} {item} for {total}g.',
      'Sold {count} {item} for {total}g. Nicely done.',
      'Sold {count} {item} for {total}g. The purse grows fat and pleased with itself.',
    ],
    vi: 'Đã bán {count} {item} được {total}g.',
  },
  'shop.sellAll.none': {
    en: ['No produce in the bag.', 'No produce in the bag.', 'No produce in the bag.', 'Not a scrap of produce in the bag.', 'Not a scrap of produce in the bag. Go and grow something.'],
    vi: 'Trong túi không có nông sản nào.',
  },
  'shop.sellAll.ok': {
    en: [
      'Sold {count} produce for {total}g.',
      'Sold {count} produce for {total}g.',
      'Sold {count} produce for {total}g.',
      'Sold {count} produce for {total}g. A good day at the market.',
      'Sold {count} produce for {total}g. The whole bag empties and the purse sings.',
    ],
    vi: 'Đã bán {count} nông sản được {total}g.',
  },
  'shop.note.crop': {
    en: [
      'Grows in {days} days, sells for {price}g.',
      'Grows in {days} days, sells for {price}g.',
      'Grows in {days} days and sells for {price}g.',
      'Ready in {days} days, worth {price}g at the counter.',
      'Ready in {days} days and worth {price}g at the counter, assuming you water it.',
    ],
    vi: 'Lớn trong {days} ngày và bán được {price}g.',
  },
  'shop.note.cropRegrow': {
    en: [
      'Grows in {days} days, regrows every {regrow} days, sells for {price}g.',
      'Grows in {days} days, regrows every {regrow} days, sells for {price}g.',
      'Grows in {days} days, then regrows every {regrow} days, and sells for {price}g.',
      'Ready in {days} days, back again every {regrow} days, worth {price}g each time.',
      'Ready in {days} days, back again every {regrow} days, worth {price}g each time — the gift that keeps giving.',
    ],
    vi: 'Lớn trong {days} ngày, rồi cứ {regrow} ngày lại ra quả, và bán được {price}g.',
  },
  'shop.note.sprinkler': {
    en: [
      'Waters {count} tiles each night.',
      'Waters {count} tiles each night.',
      'Waters {count} tiles every night.',
      'Waters {count} tiles every night, for free, forever.',
      'Waters {count} tiles every night, for free, forever, and never once asks for a day off.',
    ],
    vi: 'Tưới nước cho {count} ô mỗi đêm.',
  },
  'shop.note.fertilizer': {
    en: [
      'Faster growth and better quality.',
      'Faster growth and better quality.',
      'Faster growth and better quality produce.',
      'Faster growth and better produce. Worth every coin.',
      'Faster growth and better produce. Worth every single coin you throw at it.',
    ],
    vi: 'Cây lớn nhanh hơn và nông sản chất lượng tốt hơn.',
  },
  'shop.title': {
    en: ['Shop', 'Shop', 'The shop', 'The shop', 'The shop, and its patient shopkeeper'],
    vi: 'Cửa hàng',
  },
  'shop.price': {
    en: ['{price}g each', '{price}g each', '{price}g each', '{price}g each', '{price}g each, take it or leave it'],
    vi: '{price}g mỗi cái',
  },
  'shop.stock.unlimited': {
    en: ['Always in stock', 'Always in stock', 'Always in stock', 'Always in stock', 'Always in stock, somehow'],
    vi: 'Luôn có hàng',
  },
} as const

// ===========================================================================
// EXTRA — keys the shell lanes render under their own naming, where the
// wording or the parameter list is genuinely different from anything above.
// ===========================================================================

const EXTRA = {
  'settings.sections.label': {
    en: ['Settings sections', 'Settings sections', 'Settings sections', 'The settings sections', 'The settings sections, all eight of them'],
    vi: 'Các mục cài đặt',
  },
  'settings.sections.count': {
    en: ['{section}, {count} settings', '{section}, {count} settings', '{section} — {count} settings', '{section}, holding {count} settings', '{section}, presiding over {count} settings'],
    vi: '{section} — {count} cài đặt',
  },
  'settings.language.disclosure': {
    en: ['What the funny level does', 'What the funny level does', 'What the funny level actually does', 'What the funny level actually does', 'What the funny level actually does, and what it never does'],
    vi: 'Mức hài hước thực sự làm gì',
  },
  'settings.language.disclosure.desc': {
    en: ['Voice changes. Facts do not.', 'Voice changes. Facts do not.', 'The voice changes. The facts do not.', 'The voice changes. The facts do not, ever.', 'The voice changes. The facts do not, ever, under any circumstances.'],
    vi: 'Giọng điệu thay đổi. Sự thật thì không.',
  },
  'settings.language.disclosure.body': {
    en: [
      'The funny level changes the wording of every message, including warnings and failures. It never changes a fact: a number, a name, a file path, a key binding, an error code and a crop price read the same at every level.',
      'The funny level changes the wording of every message, including warnings and failures. It never changes a fact: a number, a name, a file path, a key binding, an error code and a crop price read the same at every level.',
      'The funny level restyles every message you will ever see, warnings and failures included. What it will never do is touch a fact — a number, a name, a file path, a key binding, an error code and a crop price read exactly the same at every level.',
      'The funny level restyles every message in the app, warnings and failures included, so do not expect a quiet life at the top of the dial. What it will never do is touch a fact: a number, a name, a file path, a key binding, an error code and a crop price read exactly the same at every level.',
      'The funny level restyles every message this app will ever say to you — warnings, failures, disasters and all. But it is under strict orders and it never touches a fact: a number, a name, a file path, a key binding, an error code and a crop price read exactly, identically, immovably the same at every level.',
    ],
    vi: 'Mức hài hước làm mới phong cách của mọi thông báo bạn sẽ thấy, kể cả cảnh báo và lỗi. Nhưng nó sẽ không bao giờ đụng đến sự thật — một con số, một cái tên, một đường dẫn tệp, một phím tắt, một mã lỗi hay giá nông sản đều đọc y hệt nhau ở mọi cấp độ.',
  },
  'settings.language.funny.desc': {
    en: [
      'English and Vietnamese are dialled separately.',
      'English and Vietnamese are dialled separately.',
      'English and Vietnamese are dialled separately, so one can be plain while the other plays.',
      'English and Vietnamese are dialled separately, so one can behave while the other misbehaves.',
      'English and Vietnamese are dialled separately, so one can stay respectable while the other runs riot.',
    ],
    vi: 'Mức hài hước chỉ áp dụng cho tiếng Anh; tiếng Việt chỉ có một giọng duy nhất.',
  },
  'settings.language.funny.level': {
    en: ['Level {level}', 'Level {level}', 'Level {level}', 'Level {level}', 'Level {level}'],
    vi: 'Cấp {level}',
  },
  'settings.language.sampleLine': {
    en: [
      '{crop} sells for {price}g. Press {key} to sleep.',
      '{crop} sells for {price}g. Press {key} to sleep.',
      'A {crop} sells for {price}g, and {key} puts you to bed.',
      'A {crop} will fetch you {price}g, and {key} puts you to bed. Not bad.',
      'A single {crop} will fetch you a princely {price}g, and one press of {key} sends you to bed a richer soul.',
    ],
    vi: '{crop} bán được {price}g, và {key} đưa bạn đi ngủ.',
  },
  'settings.language.changed': {
    en: ['Language set to {lang}.', 'Language set to {lang}.', 'Now speaking {lang}.', 'Right then — {lang} it is.', 'From this moment on, we speak {lang}.'],
    vi: 'Đã chuyển sang {lang}.',
  },
  'settings.motion.captions': {
    en: ['Caption the game', 'Caption the game', 'Caption what the game does', 'Caption what the game does', 'Caption everything the game does, in words'],
    vi: 'Chú thích những gì trò chơi làm',
  },
  'settings.motion.captions.desc': {
    en: [
      'Show game messages as text in the shell as well as on the canvas.',
      'Show game messages as text in the shell as well as on the canvas.',
      'Game messages appear as real text in the shell, not only as pixels on the canvas.',
      'Game messages appear as real text in the shell, not only as pixels a screen reader cannot read.',
      'Game messages appear as real, selectable text in the shell, not only as pixels a screen reader would stare at helplessly.',
    ],
    vi: 'Thông báo của trò chơi hiện dưới dạng chữ thật trong giao diện, chứ không chỉ là điểm ảnh trên canvas.',
  },
  'settings.motion.changed': {
    en: ['Motion set to {mode}. Currently {effective}.', 'Motion set to {mode}. Currently {effective}.', 'Motion is now {mode}, which works out as {effective}.', 'Motion is now {mode}, which works out as {effective} right now.', 'Motion is now {mode}, which after consulting your system works out as {effective}.'],
    vi: 'Chuyển động giờ là {mode}, tức là {effective}.',
  },
  'settings.motion.verbosity': {
    en: ['Announcement detail', 'Announcement detail', 'How much is announced', 'How much gets announced', 'How much the live region says out loud'],
    vi: 'Mức độ thông báo',
  },
  'settings.motion.verbosity.desc': {
    en: [
      'How much detail the screen reader live region carries.',
      'How much detail the screen reader live region carries.',
      'How much detail goes into the live region a screen reader reads.',
      'How much detail goes into the live region — terse, or the full running commentary.',
      'How much detail goes into the live region: terse, or the full breathless running commentary.',
    ],
    vi: 'Mức chi tiết được đưa vào vùng trực tiếp mà trình đọc màn hình đọc lên.',
  },
  'settings.motion.verbosity.changed': {
    en: ['Announcement detail set to {level}.', 'Announcement detail set to {level}.', 'Announcement detail is now {level}.', 'Announcement detail is now {level}.', 'Announcement detail is now {level}. The live region has been informed.'],
    vi: 'Mức chi tiết của thông báo giờ là {level}.',
  },
  'settings.motion.farmNote': {
    en: [
      'The farm honours this setting too.',
      'The farm honours this setting too.',
      'The farm honours this setting as well as the shell.',
      'The farm honours this setting as well as the shell — both surfaces, one preference.',
      'The farm honours this setting as well as the shell. Two surfaces, one preference, no arguing.',
    ],
    vi: 'Trang trại cũng tôn trọng cài đặt này, cùng với giao diện.',
  },
  'settings.scale.changed': {
    en: ['Scale set to {scale}.', 'Scale set to {scale}.', 'Scale is now {scale}.', 'Scale is now {scale}.', 'Scale is now {scale}, and everything has shuffled to suit.'],
    vi: 'Tỉ lệ giờ là {scale}.',
  },
  'settings.audio.volume': {
    en: ['Volume', 'Volume', 'Volume', 'How loud', 'How loud the valley is allowed to be'],
    vi: 'Âm lượng',
  },
  'settings.audio.volume.desc': {
    en: [
      'The master gain for every synthesised sound.',
      'The master gain for every synthesised sound.',
      'The master gain for every sound the app makes up.',
      'The master gain for every sound the app makes up on the spot.',
      'The master gain for every sound the app conjures out of arithmetic on the spot.',
    ],
    vi: 'Độ khuếch đại chính cho mọi âm thanh mà ứng dụng tạo ra.',
  },
  'settings.audio.volume.value': {
    en: ['{percent}%', '{percent}%', '{percent}%', '{percent}%', '{percent}%'],
    vi: '{percent}%',
  },
  'settings.audio.muted': {
    en: ['Muted', 'Muted', 'Muted', 'Muted, and quite peaceful', 'Muted. The valley holds its breath.'],
    vi: 'Đã tắt tiếng',
  },
  'settings.audio.unmuted': {
    en: ['Sound on', 'Sound on', 'Sound on', 'Sound on and audible', 'Sound on. The valley clears its throat.'],
    vi: 'Đang bật tiếng',
  },
  'settings.audio.test.played': {
    en: ['That is what it sounds like.', 'That is what it sounds like.', 'That is what it sounds like.', 'That is what it sounds like. Happy?', 'That is what it sounds like. A tiny masterpiece, made of arithmetic.'],
    vi: 'Âm thanh nghe như thế đó.',
  },
  'settings.game.farmKeys': {
    en: ['Farm keys in the shell', 'Farm keys in the shell', 'Farm keys while the shell has focus', 'Farm keys while the shell has focus', 'Whether farm keys still work while the shell has focus'],
    vi: 'Phím trang trại khi giao diện đang được chọn',
  },
  'settings.game.farmKeys.desc': {
    en: [
      'Whether the game keys work when a shell control has focus.',
      'Whether the game keys work when a shell control has focus.',
      'Whether the game keys still reach the farm when a shell control has focus.',
      'Whether the game keys still reach the farm when a shell control has focus. Off is safer for typing.',
      'Whether the game keys still reach the farm when a shell control has focus. Off is safer, unless you enjoy sowing seeds mid-sentence.',
    ],
    vi: 'Các phím của trò chơi có còn tới được trang trại khi một nút điều khiển của giao diện đang được chọn hay không.',
  },
  'settings.game.farmKeys.changed': {
    en: ['Farm keys set to {mode}.', 'Farm keys set to {mode}.', 'Farm keys are now {mode}.', 'Farm keys are now {mode}.', 'Farm keys are now {mode}, and the farm has been told.'],
    vi: 'Phím trang trại giờ là {mode}.',
  },
  'settings.game.keepAwake': {
    en: ['Keep the screen awake', 'Keep the screen awake', 'Keep the screen awake', 'Keep the screen from sleeping', 'Keep the screen from nodding off mid-harvest'],
    vi: 'Giữ màn hình luôn sáng',
  },
  'settings.game.keepAwake.desc': {
    en: [
      'Uses the browser wake lock while the farm is visible.',
      'Uses the browser wake lock while the farm is visible.',
      'Uses the browser wake lock while the farm tab is visible.',
      'Uses the browser wake lock while the farm tab is visible, and gives it back when it is not.',
      'Uses the browser wake lock while the farm tab is visible, and hands it straight back when it is not. No hoarding.',
    ],
    vi: 'Dùng khóa thức của trình duyệt khi thẻ trang trại đang hiển thị.',
  },
  'settings.game.keepAwake.idle': {
    en: ['Not held', 'Not held', 'Not held right now', 'Not held right now', 'Not held right now, and quite relaxed about it'],
    vi: 'Hiện không giữ',
  },
  'settings.game.keepAwake.held': {
    en: ['Held', 'Held', 'Held right now', 'Held right now', 'Held right now, and holding firm'],
    vi: 'Hiện đang giữ',
  },
  'settings.game.keepAwake.refused': {
    en: ['The system refused it.', 'The system refused it.', 'The system refused the request.', 'The system said no.', 'The system said no, flatly, and offered no reason.'],
    vi: 'Hệ thống đã từ chối yêu cầu.',
  },
  'settings.game.keepAwake.unsupported': {
    en: ['Not supported here.', 'Not supported here.', 'Not supported on this machine.', 'Not supported on this machine, sadly.', 'Not supported on this machine. Some things are simply not to be.'],
    vi: 'Máy này không hỗ trợ.',
  },
  'settings.game.muteOnBlur': {
    en: ['Mute when the window is away', 'Mute when the window is away', 'Mute when the window loses focus', 'Mute the moment the window loses focus', 'Mute the instant the window loses focus, out of sheer politeness'],
    vi: 'Tắt tiếng khi cửa sổ mất tiêu điểm',
  },
  'settings.game.muteOnBlur.desc': {
    en: [
      'The valley goes quiet when you switch to something else.',
      'The valley goes quiet when you switch to something else.',
      'The valley goes quiet the moment you switch to something else.',
      'The valley goes quiet the moment you switch away, and speaks up again when you come back.',
      'The valley goes quiet the moment you switch away, and clears its throat again the moment you return.',
    ],
    vi: 'Thung lũng lặng đi ngay khi bạn chuyển sang việc khác.',
  },
  'settings.appearance.editor': {
    en: ['The appearance editor', 'The appearance editor', 'The appearance editor', 'The appearance editor', 'The appearance editor, and how to summon it'],
    vi: 'Trình chỉnh giao diện',
  },
  'settings.appearance.editor.desc': {
    en: [
      'Every rendered element can be edited and reset.',
      'Every rendered element can be edited and reset.',
      'Every element on screen can be edited, and every edit can be reset.',
      'Every element on screen can be edited, and every edit put back. Nothing is permanent.',
      'Every element on screen can be edited, and every edit put back. Nothing here is permanent, least of all your taste.',
    ],
    vi: 'Mọi phần tử trên màn hình đều chỉnh được, và mọi chỉnh sửa đều đặt lại được.',
  },
  'settings.appearance.editor.hint': {
    en: [
      'Right-click an element, or press {chord} while it has focus.',
      'Right-click an element, or press {chord} while it has focus.',
      'Right-click any element, or press {chord} while it has focus.',
      'Right-click anything at all, or press {chord} while it has focus.',
      'Right-click anything at all, or press {chord} while it has focus. Nothing is safe from you.',
    ],
    vi: 'Nhấp chuột phải vào bất kỳ phần tử nào, hoặc bấm {chord} khi nó đang được chọn.',
  },
  'settings.appearance.editor.open': {
    en: ['Open the appearance editor', 'Open the appearance editor', 'Open the appearance editor', 'Open the appearance editor', 'Summon the appearance editor'],
    vi: 'Mở trình chỉnh giao diện',
  },
  'settings.appearance.colour': {
    en: ['Palette colours', 'Palette colours', 'The palette colours', 'The fourteen palette colours', 'All fourteen palette colours, yours to repoint'],
    vi: 'Các màu trong bảng màu',
  },
  'settings.appearance.colour.desc': {
    en: [
      'Both surfaces draw from these fourteen entries.',
      'Both surfaces draw from these fourteen entries.',
      'The game and the shell both draw from these fourteen entries.',
      'The game and the shell both draw from these fourteen entries. Change one and both follow.',
      'The game and the shell both draw from these fourteen entries. Change one and the whole valley changes with it.',
    ],
    vi: 'Cả trò chơi lẫn giao diện đều lấy màu từ mười bốn mục này.',
  },
  'settings.appearance.colour.reset': {
    en: ['Reset this colour', 'Reset this colour', 'Put this colour back', 'Put this colour back how it was', 'Return this colour to the valley it came from'],
    vi: 'Trả màu này về như cũ',
  },
  'settings.appearance.colour.wasReset': {
    en: ['{name} is back to {base}.', '{name} is back to {base}.', '{name} is back to {base}.', '{name} has gone back to {base}.', '{name} has marched back to {base}, older and wiser.'],
    vi: '{name} đã trở về {base}.',
  },
  'settings.appearance.resetAll.action': {
    en: ['Reset all appearance', 'Reset all appearance', 'Reset every appearance change', 'Undo every appearance change', 'Undo every last appearance change in one sweep'],
    vi: 'Đặt lại mọi thay đổi giao diện',
  },
  'settings.appearance.resetAll.desc': {
    en: [
      'Every element goes back to the stylesheet.',
      'Every element goes back to the stylesheet.',
      'Every element goes back to what the stylesheet says.',
      'Every element goes back to what the stylesheet says, and your edits are gone.',
      'Every element goes back to what the stylesheet says, and every edit you made is quietly forgotten.',
    ],
    vi: 'Mọi phần tử trở về đúng như bảng định kiểu quy định.',
  },
  'settings.appearance.resetAll.confirmTitle': {
    en: ['Reset all appearance?', 'Reset all appearance?', 'Reset every appearance change?', 'Really undo every appearance change?', 'Truly undo every appearance change you ever made?'],
    vi: 'Đặt lại mọi thay đổi giao diện?',
  },
  'settings.appearance.resetAll.confirmBody': {
    en: ['Every element goes back to its default. This cannot be undone.', 'Every element goes back to its default. This cannot be undone.', 'Every element goes back to its default, and there is no undo.', 'Every element goes back to its default. There is no undo for this one.', 'Every element marches back to its default. There is no undo, no backup and no mercy.'],
    vi: 'Mọi phần tử trở về mặc định, và không hoàn tác được.',
  },
  'settings.appearance.resetAll.done': {
    en: ['{count} elements reset.', '{count} elements reset.', '{count} elements are back to their defaults.', '{count} elements are back to their defaults.', '{count} elements have returned to their defaults, blinking.'],
    vi: '{count} phần tử đã trở về mặc định.',
  },
  'settings.data.export.action': {
    en: ['Export now', 'Export now', 'Export it now', 'Export it now', 'Export it now, while you remember'],
    vi: 'Xuất ngay',
  },
  'settings.data.export.desc': {
    en: [
      'Pick a target and a format. Nothing is uploaded.',
      'Pick a target and a format. Nothing is uploaded.',
      'Pick what to export and in what format. Nothing is uploaded anywhere.',
      'Pick what to export and in what format. Nothing is uploaded anywhere, to anyone.',
      'Pick what to export and in what format. Nothing is uploaded anywhere, to anyone, ever.',
    ],
    vi: 'Chọn thứ cần xuất và định dạng. Không có gì được tải lên bất cứ đâu.',
  },
  'settings.data.export.done': {
    en: ['Saved {filename}, {bytes} bytes.', 'Saved {filename}, {bytes} bytes.', 'Saved {filename} — {bytes} bytes.', 'Saved {filename}, all {bytes} bytes of it.', 'Saved {filename}, all {bytes} bytes of it. Look after it.'],
    vi: 'Đã lưu {filename} — {bytes} byte.',
  },
  'settings.data.export.failed': {
    en: ['Could not export {target} as {format}.', 'Could not export {target} as {format}.', 'That export of {target} as {format} did not work.', 'The export of {target} as {format} fell over.', 'The export of {target} as {format} fell over in spectacular fashion.'],
    vi: 'Xuất {target} dưới dạng {format} không thành công.',
  },
  'settings.data.export.unavailable': {
    en: ['Downloads are unavailable here.', 'Downloads are unavailable here.', 'Downloads are not available in this build.', 'Downloads are not available in this build, sorry.', 'Downloads are not available in this build. Copy it to the clipboard instead.'],
    vi: 'Bản build này không hỗ trợ tải xuống.',
  },
  'settings.data.import.action': {
    en: ['Choose a file', 'Choose a file', 'Choose a file', 'Choose a file to bring in', 'Choose a file, and let us see what is in it'],
    vi: 'Chọn một tệp',
  },
  'settings.data.import.desc': {
    en: [
      'Reads a file this app exported earlier.',
      'Reads a file this app exported earlier.',
      'Reads a file this app exported earlier. Nothing else is accepted.',
      'Reads a file this app exported earlier. It will not take anything else.',
      'Reads a file this app exported earlier, and flatly refuses anything else.',
    ],
    vi: 'Đọc tệp mà ứng dụng này đã xuất trước đó. Không chấp nhận gì khác.',
  },
  'settings.data.import.confirmTitle': {
    en: ['Import and replace?', 'Import and replace?', 'Import and replace what is here?', 'Import this and replace what is here?', 'Import this and replace everything currently here?'],
    vi: 'Nhập vào và thay thế những gì đang có?',
  },
  'settings.data.import.confirmBody': {
    en: [
      '{file} replaces: {parts}. This cannot be undone.',
      '{file} replaces: {parts}. This cannot be undone.',
      '{file} will replace: {parts}. There is no undo.',
      '{file} will replace: {parts}. There is no undo for this one.',
      '{file} will replace: {parts}. There is no undo, no backup and no going back.',
    ],
    vi: '{file} sẽ thay thế: {parts}. Không hoàn tác được.',
  },
  'settings.data.import.done': {
    en: ['Imported.', 'Imported.', 'Imported and applied.', 'Imported and applied. Everything is in.', 'Imported and applied. Everything arrived safely.'],
    vi: 'Đã nhập và áp dụng.',
  },
  'settings.data.import.failed': {
    en: ['Could not import {file}.', 'Could not import {file}.', '{file} could not be imported.', '{file} refused to be imported.', '{file} refused to be imported, and offered no explanation.'],
    vi: 'Không nhập được {file}.',
  },
  'settings.data.import.noFile': {
    en: ['No file was chosen.', 'No file was chosen.', 'No file was chosen.', 'No file was chosen, so nothing happened.', 'No file was chosen, so absolutely nothing happened.'],
    vi: 'Chưa chọn tệp nào.',
  },
  'settings.data.import.nothing': {
    en: ['{file} held nothing to import.', '{file} held nothing to import.', '{file} had nothing in it to import.', '{file} had nothing in it worth importing.', '{file} had nothing in it worth importing. A beautiful, empty gesture.'],
    vi: '{file} không có gì để nhập.',
  },
  'settings.data.import.unreadable': {
    en: ['{file} could not be read.', '{file} could not be read.', '{file} could not be read.', '{file} makes no sense at all.', '{file} makes no sense whatsoever, and we tried very hard.'],
    vi: 'Không đọc được {file}.',
  },
  'settings.data.import.unavailable': {
    en: ['File reading is unavailable here.', 'File reading is unavailable here.', 'File reading is not available in this build.', 'File reading is not available in this build, sorry.', 'File reading is not available in this build. Paste the text instead.'],
    vi: 'Bản build này không hỗ trợ đọc tệp.',
  },
  'settings.data.clearHistory.action': {
    en: ['Clear the history', 'Clear the history', 'Clear the history', 'Wipe the history', 'Wipe the history and forget it all'],
    vi: 'Xóa lịch sử',
  },
  'settings.data.clearHistory.desc': {
    en: [
      'Deletes the local history. Settings and appearance stay.',
      'Deletes the local history. Settings and appearance stay.',
      'Deletes the local history and leaves your settings and appearance alone.',
      'Deletes the local history and leaves your settings and appearance untouched.',
      'Deletes the local history and leaves your settings and appearance entirely untouched.',
    ],
    vi: 'Xóa lịch sử trên máy và giữ nguyên cài đặt cùng giao diện của bạn.',
  },
  'settings.data.clearHistory.confirmTitle': {
    en: ['Clear the history?', 'Clear the history?', 'Clear the history?', 'Really wipe the history?', 'Truly wipe every trace of the past?'],
    vi: 'Xóa lịch sử?',
  },
  'settings.data.clearHistory.confirmBody': {
    en: ['Every entry is deleted. This cannot be undone.', 'Every entry is deleted. This cannot be undone.', 'Every entry is deleted, and there is no undo.', 'Every entry goes in the bin, and there is no undo.', 'Every entry goes in the bin, never to be seen again. There is no undo.'],
    vi: 'Mọi mục đều bị xóa, và không hoàn tác được.',
  },
  'settings.data.clearHistory.done': {
    en: ['The history is cleared.', 'The history is cleared.', 'The history is cleared.', 'The history is gone.', 'The history is gone without a trace.'],
    vi: 'Đã xóa lịch sử.',
  },
  'settings.data.clearHistory.failed': {
    en: ['The history could not be cleared.', 'The history could not be cleared.', 'The history could not be cleared.', 'The history refused to be cleared.', 'The history refused to be cleared. It clings on.'],
    vi: 'Không xóa được lịch sử.',
  },
  'settings.data.clearHistory.unavailable': {
    en: ['There is no history to clear.', 'There is no history to clear.', 'There is no history to clear.', 'There is no history here to clear.', 'There is no history here to clear. You have been admirably restrained.'],
    vi: 'Không có lịch sử nào để xóa.',
  },
  'settings.data.resetAll.action': {
    en: ['Reset everything', 'Reset everything', 'Reset everything', 'Wipe the lot', 'Wipe the lot and start from nothing'],
    vi: 'Đặt lại mọi thứ',
  },
  'settings.data.resetAll.failed': {
    en: ['The reset did not finish.', 'The reset did not finish.', 'The reset did not finish.', 'The reset fell over halfway.', 'The reset fell over halfway, which is the worst possible place.'],
    vi: 'Việc đặt lại chưa hoàn tất.',
  },
  'settings.about.accessibility': {
    en: ['Accessibility', 'Accessibility', 'Accessibility', 'Accessibility', 'Accessibility, and how seriously we take it'],
    vi: 'Hỗ trợ tiếp cận',
  },
  'settings.about.accessibility.desc': {
    en: [
      'Keyboard reachable, screen reader friendly, reduced motion honoured.',
      'Keyboard reachable, screen reader friendly, reduced motion honoured.',
      'Everything is keyboard reachable, screen readers are told the truth, and reduced motion is honoured.',
      'Everything is keyboard reachable, screen readers are told the truth, and reduced motion is honoured everywhere.',
      'Everything is keyboard reachable, screen readers are told the truth, and reduced motion is honoured everywhere. No costumes.',
    ],
    vi: 'Mọi thứ đều dùng được bằng bàn phím, trình đọc màn hình được báo đúng sự thật, và chế độ giảm chuyển động được tôn trọng.',
  },
  'settings.about.licence.desc': {
    en: ['The licence this application ships under.', 'The licence this application ships under.', 'The licence this application ships under.', 'The licence this application ships under. Read it if you like.', 'The licence this application ships under. Read it, if that is your idea of an evening.'],
    vi: 'Giấy phép mà ứng dụng này được phát hành theo.',
  },
  'settings.about.licence.missing': {
    en: ['The licence text is not bundled.', 'The licence text is not bundled.', 'The licence text is not bundled in this build.', 'The licence text is not bundled in this build, awkwardly.', 'The licence text is not bundled in this build, which is faintly embarrassing.'],
    vi: 'Bản build này không đi kèm nội dung giấy phép.',
  },
  'settings.about.version.desc': {
    en: ['The build and its save format.', 'The build and its save format.', 'The build, and the save format it reads.', 'The build, and the save format it can read.', 'The build, and the save format it will happily read.'],
    vi: 'Bản build, và định dạng bản lưu mà nó đọc được.',
  },
  'settings.about.version.value': {
    en: ['Version {version}, save format {save}', 'Version {version}, save format {save}', 'Version {version}, save format {save}', 'Version {version}, save format {save}', 'Version {version}, save format {save}'],
    vi: 'Phiên bản {version}, định dạng bản lưu {save}',
  },
  'settings.about.version.unknown': {
    en: ['Unknown', 'Unknown', 'Unknown', 'Nobody knows', 'Nobody knows, and nobody will say'],
    vi: 'Không rõ',
  },
  'settings.about.version.copy': {
    en: ['Copy the version', 'Copy the version', 'Copy the version', 'Copy the version', 'Copy the version, for the bug report'],
    vi: 'Sao chép phiên bản',
  },
  'settings.about.version.copied': {
    en: ['Copied {version}.', 'Copied {version}.', 'Copied {version}.', '{version} is on your clipboard.', '{version} now lives in your clipboard.'],
    vi: 'Đã chép {version}.',
  },
  'settings.search.placeholder': {
    en: ['Search settings', 'Search settings', 'What are you looking for?', 'What are you after?', 'Name it and it shall be found'],
    vi: 'Bạn đang tìm gì?',
  },
  'settings.search.describe': {
    en: [
      'Every setting label, description and value on this tab.',
      'Every setting label, description and value on this tab.',
      'Every setting label, description and value on this tab.',
      'Every label, description and value on this tab, all at once.',
      'Every label, description and value on this tab, all at once, and nothing hides.',
    ],
    vi: 'Mọi nhãn, mô tả và giá trị của cài đặt trên thẻ này.',
  },
  'settings.search.idle': {
    en: ['{count} settings.', '{count} settings.', '{count} settings on this tab.', '{count} settings on this tab, waiting.', '{count} settings on this tab, waiting to be fiddled with.'],
    vi: '{count} cài đặt trên thẻ này.',
  },
  'settings.search.results': {
    en: ['{count} settings match {query}.', '{count} settings match {query}.', '{count} settings match {query}.', '{count} settings answered to {query}.', '{count} settings came running when you said {query}.'],
    vi: '{count} cài đặt khớp với {query}.',
  },
  'settings.search.matches': {
    en: ['{count} matches in the sample.', '{count} matches in the sample.', '{count} matches in the sample.', '{count} matches found in the sample.', '{count} matches hunted down in the sample.'],
    vi: '{count} kết quả khớp trong văn bản mẫu.',
  },
  'settings.search.invalid': {
    en: ['Not a valid pattern at character {index}: {error}', 'Not a valid pattern at character {index}: {error}', 'The pattern breaks at character {index}: {error}', 'The pattern falls over at character {index}: {error}', 'The pattern falls flat on its face at character {index}: {error}'],
    vi: 'Mẫu bị lỗi ở ký tự {index}: {error}',
  },
  'settings.search.timedOut': {
    en: ['The pattern took too long and was stopped.', 'The pattern took too long and was stopped.', 'The pattern was taking too long, so it was stopped.', 'The pattern went wandering, so it was stopped.', 'The pattern wandered off into the wilderness, so it was hauled back.'],
    vi: 'Mẫu chạy quá lâu nên đã bị dừng.',
  },
  'settings.search.dialect': {
    en: ['Dialect: {dialect}.', 'Dialect: {dialect}.', 'This searches with {dialect}.', 'This searches with {dialect}, and nothing else.', 'This searches with {dialect}, and nothing else. No lookbehind fantasies.'],
    vi: 'Phần tìm kiếm này dùng {dialect}.',
  },
  'settings.search.sample': {
    en: ['Sample text, up to {limit} characters', 'Sample text, up to {limit} characters', 'Sample text, up to {limit} characters', 'Sample text, {limit} characters at most', 'Sample text, {limit} characters at most, for everyone’s sake'],
    vi: 'Văn bản mẫu, tối đa {limit} ký tự',
  },
  'settings.search.copied': {
    en: ['Copied {pattern}.', 'Copied {pattern}.', 'Copied {pattern}.', '{pattern} is on your clipboard.', '{pattern} now lives in your clipboard.'],
    vi: 'Đã chép {pattern}.',
  },
  'settings.search.inSection': {
    en: ['In {section}', 'In {section}', 'In {section}', 'Over in {section}', 'Over in {section}, since you ask'],
    vi: 'Trong {section}',
  },
  'settings.search.apply': {
    en: ['Apply the pattern', 'Apply the pattern', 'Apply the pattern', 'Put the pattern to work', 'Set the pattern loose on the settings'],
    vi: 'Áp dụng mẫu',
  },
  'settings.search.reloadSample': {
    en: ['Reload the sample', 'Reload the sample', 'Reload the sample text', 'Reload the sample text', 'Fetch a fresh sample to torment'],
    vi: 'Tải lại văn bản mẫu',
  },
  'settings.search.insertLiteral': {
    en: ['Insert as literal text', 'Insert as literal text', 'Insert it as literal text, escaped', 'Insert it as literal text, escaped for you', 'Insert it as literal text, escaped for you, no surprises'],
    vi: 'Chèn dưới dạng văn bản nguyên văn, đã thoát ký tự',
  },
  'settings.search.regexToggleHint': {
    en: [
      'Plain text is the default. Regex is an explicit choice.',
      'Plain text is the default. Regex is an explicit choice.',
      'Plain text unless you say otherwise — regex is always an explicit choice.',
      'Plain text unless you say otherwise. Regex is always your explicit choice.',
      'Plain text unless you say otherwise. Regex is always your explicit choice, and your responsibility.',
    ],
    vi: 'Mặc định là văn bản thường — regex luôn là lựa chọn có chủ ý.',
  },
  'settings.search.token.named': {
    en: ['Named group', 'Named group', 'A named capture group', 'A named capture group', 'A named capture group, for the organised'],
    vi: 'Một nhóm bắt có tên',
  },
  'settings.search.token.notClass': {
    en: ['None of these characters', 'None of these characters', 'None of these characters', 'Anything except these characters', 'Anything at all except these characters'],
    vi: 'Không phải một trong các ký tự này',
  },
  'settings.search.token.count': {
    en: ['A counted repeat', 'A counted repeat', 'A counted repeat', 'A repeat with a count on it', 'A repeat with a strict count on it'],
    vi: 'Một lần lặp có đếm số',
  },

  // ---- the dim sum surprise, as the docs lane names it ---------------------

  'surprise.toggle': {
    en: ['Show the dim sum trolley', 'Show the dim sum trolley', 'Show the dim sum trolley', 'Bring out the dim sum trolley', 'Wheel out the dim sum trolley, and mind the tea'],
    vi: 'Cho xem xe đẩy dimsum',
  },
  'surprise.command.toggle': {
    en: ['Dim sum: show or hide the trolley', 'Dim sum: show or hide the trolley', 'Dim sum: show or hide the trolley', 'Dim sum: wheel the trolley in or out', 'Dim sum: wheel the trolley in, or wheel it sadly away'],
    vi: 'Dimsum: hiện hoặc ẩn xe đẩy',
  },
  'surprise.group': {
    en: ['Appearance', 'Appearance', 'Appearance', 'Appearance', 'Appearance'],
    vi: 'Giao diện',
  },

  // ---- the appearance editor, as the appearance lane names it -------------

  'appearance.editor.close': {
    en: ['Close the editor', 'Close the editor', 'Close the editor', 'Put the editor away', 'Dismiss the editor, with thanks'],
    vi: 'Đóng trình chỉnh',
  },
  'appearance.editor.properties': {
    en: ['Properties', 'Properties', 'Properties', 'The properties', 'Every property, laid out for you'],
    vi: 'Thuộc tính',
  },
  'appearance.menu.title': {
    en: ['Appearance of {element}', 'Appearance of {element}', 'How {element} looks', 'Dressing up {element}', 'The complete wardrobe of {element}'],
    vi: 'Giao diện của {element}',
  },
  'appearance.menu.items': {
    en: ['Appearance actions', 'Appearance actions', 'Things you can do here', 'Things you can do to it', 'Everything you can do to this poor element'],
    vi: 'Những việc bạn có thể làm ở đây',
  },
  'appearance.field.borderWidth': {
    en: ['Border width', 'Border width', 'Border width', 'How thick the frame is', 'How thick the carved frame is'],
    vi: 'Độ dày viền',
  },
  'appearance.field.edit': {
    en: ['Edit {property}, currently {value}', 'Edit {property}, currently {value}', 'Edit {property} — currently {value}', 'Change {property}, which is {value} right now', 'Change {property}, which is currently sporting {value}'],
    vi: 'Sửa {property} — hiện là {value}',
  },
  'appearance.field.number': {
    en: ['{property} in {unit}', '{property} in {unit}', '{property}, in {unit}', '{property}, measured in {unit}', '{property}, measured in {unit}, precisely'],
    vi: '{property}, tính bằng {unit}',
  },
  'appearance.field.slider': {
    en: ['{property} slider, in {unit}', '{property} slider, in {unit}', '{property} slider, in {unit}', 'Slide to set {property}, in {unit}', 'Slide to set {property}, in {unit}, to your heart’s content'],
    vi: 'Thanh trượt {property}, tính bằng {unit}',
  },
  'appearance.field.value': {
    en: ['{value}{unit}', '{value}{unit}', '{value}{unit}', '{value}{unit}', '{value}{unit}'],
    vi: '{value}{unit}',
  },
  'appearance.resetAll.done': {
    en: ['{count} elements reset.', '{count} elements reset.', '{count} elements are back to their defaults.', '{count} elements are back to their defaults.', '{count} elements have returned to their defaults, blinking.'],
    vi: '{count} phần tử đã trở về mặc định.',
  },
  'appearance.colorpicker.swatches': {
    en: ['Palette swatches', 'Palette swatches', 'The palette swatches', 'The fourteen palette swatches', 'All fourteen palette swatches, lined up'],
    vi: 'Các ô màu trong bảng',
  },

  // ---- the colour picker, as the appearance lane names it -----------------

  'colorpicker.label': {
    en: ['Colour picker', 'Colour picker', 'Colour picker', 'The colour picker', 'The colour picker, in all its glory'],
    vi: 'Bộ chọn màu',
  },
  'colorpicker.field': {
    en: ['Saturation and brightness', 'Saturation and brightness', 'Saturation and brightness', 'Drag for saturation and brightness', 'Drag about for saturation and brightness'],
    vi: 'Độ bão hòa và độ sáng',
  },
  'colorpicker.fieldHelp': {
    en: [
      'Arrow keys move by one, Page Up and Page Down by ten, Home and End to the edges.',
      'Arrow keys move by one, Page Up and Page Down by ten, Home and End to the edges.',
      'Arrow keys move by one, Page Up and Page Down by ten, and Home and End go to the edges.',
      'Arrow keys nudge by one, Page Up and Page Down leap by ten, Home and End take you to the edges.',
      'Arrow keys nudge by one, Page Up and Page Down leap by ten, and Home and End fling you to the edges.',
    ],
    vi: 'Phím mũi tên di chuyển từng bước một, Page Up và Page Down di chuyển mười bước, còn Home và End đưa về hai mép.',
  },
  'colorpicker.fieldValue': {
    en: [
      'Saturation {saturation}, brightness {brightness}, {hex}',
      'Saturation {saturation}, brightness {brightness}, {hex}',
      'Saturation {saturation}, brightness {brightness} — {hex}',
      'Saturation {saturation}, brightness {brightness}, which comes out as {hex}',
      'Saturation {saturation}, brightness {brightness}, which comes out, magnificently, as {hex}',
    ],
    vi: 'Độ bão hòa {saturation}, độ sáng {brightness} — {hex}',
  },
  'colorpicker.fieldValueNamed': {
    en: [
      'Saturation {saturation}, brightness {brightness}, {hex}, which is {name}',
      'Saturation {saturation}, brightness {brightness}, {hex}, which is {name}',
      'Saturation {saturation}, brightness {brightness}, {hex} — that is {name}',
      'Saturation {saturation}, brightness {brightness}, {hex}, and that one has a name: {name}',
      'Saturation {saturation}, brightness {brightness}, {hex}, and that one has a proper name: {name}',
    ],
    vi: 'Độ bão hòa {saturation}, độ sáng {brightness}, {hex} — đó là màu {name}',
  },
  'colorpicker.hue': {
    en: ['Hue', 'Hue', 'Hue', 'Hue', 'Hue, the whole rainbow of it'],
    vi: 'Sắc độ',
  },
  'colorpicker.hueValue': {
    en: ['{degrees} degrees', '{degrees} degrees', '{degrees} degrees', '{degrees} degrees round the wheel', '{degrees} degrees round the wheel, exactly'],
    vi: '{degrees} độ',
  },
  'colorpicker.saturation': {
    en: ['Saturation', 'Saturation', 'Saturation', 'Saturation', 'Saturation, how much colour is in the colour'],
    vi: 'Độ bão hòa',
  },
  'colorpicker.brightness': {
    en: ['Brightness', 'Brightness', 'Brightness', 'Brightness', 'Brightness, from the pit to the noon'],
    vi: 'Độ sáng',
  },
  'colorpicker.alpha': {
    en: ['Opacity', 'Opacity', 'Opacity', 'How solid it is', 'How solid, or how ghostly'],
    vi: 'Độ mờ đục',
  },
  'colorpicker.percent': {
    en: ['{percent}%', '{percent}%', '{percent}%', '{percent}%', '{percent}%'],
    vi: '{percent}%',
  },
  'colorpicker.hex': {
    en: ['Hex', 'Hex', 'Hex', 'Hex', 'Hex, for the purists'],
    vi: 'Hex',
  },
  'colorpicker.rgb': {
    en: ['RGB', 'RGB', 'RGB', 'RGB', 'RGB, red green blue, the old way'],
    vi: 'RGB',
  },
  'colorpicker.hsl': {
    en: ['HSL', 'HSL', 'HSL', 'HSL', 'HSL, for people who think in hues'],
    vi: 'HSL',
  },
  'colorpicker.preview': {
    en: ['Preview of {hex}', 'Preview of {hex}', 'A preview of {hex}', 'A preview of {hex}, as it will look', 'A preview of {hex}, exactly as it will look on the wood'],
    vi: 'Xem trước {hex}',
  },
  'colorpicker.named': {
    en: ['{name}', '{name}', '{name}', '{name}', '{name}'],
    vi: '{name}',
  },
  'colorpicker.custom': {
    en: ['Custom {hex}', 'Custom {hex}', 'Your own {hex}', 'Your own {hex}, off the palette', 'Your own {hex}, chosen from outside the fourteen'],
    vi: '{hex} của riêng bạn',
  },
  'colorpicker.chose': {
    en: ['Chose {name}, {hex}.', 'Chose {name}, {hex}.', 'Chose {name} — {hex}.', 'You picked {name}, which is {hex}.', 'You picked {name}, which is {hex}. Good eye.'],
    vi: 'Đã chọn {name} — {hex}.',
  },
  'colorpicker.swatch': {
    en: ['{name}, {hex}', '{name}, {hex}', '{name} — {hex}', '{name}, which is {hex}', '{name}, which is {hex}, since you ask'],
    vi: '{name} — {hex}',
  },
  'colorpicker.swatches': {
    en: ['Palette', 'Palette', 'The palette', 'The valley palette', 'The valley palette, all fourteen of it'],
    vi: 'Bảng màu',
  },
  'colorpicker.swatchCount': {
    en: ['{shown} of {total} colours match {query}.', '{shown} of {total} colours match {query}.', '{shown} of {total} colours match {query}.', '{shown} of {total} colours answered to {query}.', '{shown} of {total} colours came running when you said {query}.'],
    vi: '{shown} trên {total} màu khớp với {query}.',
  },
  'colorpicker.swatchCountAll': {
    en: ['{total} colours.', '{total} colours.', 'All {total} colours.', 'All {total} colours, present and correct.', 'All {total} colours, present, correct and accounted for.'],
    vi: 'Tất cả {total} màu.',
  },
  'colorpicker.contrastPass': {
    en: [
      'Contrast {ratio} to 1 against {against}, above the required {required}.',
      'Contrast {ratio} to 1 against {against}, above the required {required}.',
      'Contrast is {ratio} to 1 against {against}, comfortably above the required {required}.',
      'Contrast is {ratio} to 1 against {against}, comfortably clear of the required {required}.',
      'Contrast is {ratio} to 1 against {against}, sailing clear of the required {required}.',
    ],
    vi: 'Độ tương phản là {ratio} trên 1 so với {against}, vượt thoải mái mức {required} yêu cầu.',
  },
  'colorpicker.contrastFail': {
    en: [
      'Contrast {ratio} to 1 against {against}, below the required {required}.',
      'Contrast {ratio} to 1 against {against}, below the required {required}.',
      'Contrast is only {ratio} to 1 against {against}, under the required {required}.',
      'Contrast is a feeble {ratio} to 1 against {against}, under the required {required}.',
      'Contrast limps in at {ratio} to 1 against {against}, well under the required {required}.',
    ],
    vi: 'Độ tương phản chỉ {ratio} trên 1 so với {against}, thấp hơn mức {required} yêu cầu.',
  },
  'colorpicker.contrastShort': {
    en: ['{ratio} to 1, needs {required}', '{ratio} to 1, needs {required}', '{ratio} to 1, needs {required}', '{ratio} to 1, and it needs {required}', '{ratio} to 1, and it needs {required}, so there is work to do'],
    vi: '{ratio} trên 1, cần {required}',
  },
  'colorpicker.searchLabel': {
    en: ['Search palette colours', 'Search palette colours', 'Search the palette', 'Hunt through the palette', 'Interrogate all fourteen palette colours'],
    vi: 'Tìm trong bảng màu',
  },
  'colorpicker.searchPlaceholder': {
    en: ['Search colours', 'Search colours', 'Search colours', 'Which colour?', 'Name the colour you want'],
    vi: 'Tìm màu',
  },

  // ---- the shared search field, as the picker lane names it ---------------

  'search.mode.regexShort': {
    en: ['Regex', 'Regex', 'Regex', 'Regex', 'Regex'],
    vi: 'Regex',
  },
  'search.builder.title': {
    en: ['Build a pattern', 'Build a pattern', 'Build a pattern', 'Build yourself a pattern', 'Build yourself a pattern, piece by piece'],
    vi: 'Dựng một mẫu',
  },
  'search.builder.short': {
    en: ['Builder', 'Builder', 'Builder', 'Builder', 'Builder'],
    vi: 'Trình dựng',
  },
  'search.builder.pattern': {
    en: ['Pattern', 'Pattern', 'The pattern', 'The pattern itself', 'The pattern itself, raw and unashamed'],
    vi: 'Mẫu',
  },
  'search.builder.flags': {
    en: ['Flags: {flags}', 'Flags: {flags}', 'Flags: {flags}', 'Flags in play: {flags}', 'Flags currently in play: {flags}'],
    vi: 'Cờ: {flags}',
  },
  'search.builder.noFlags': {
    en: ['none', 'none', 'none', 'none at all', 'not a single one'],
    vi: 'không có',
  },
  'search.builder.emptyPattern': {
    en: ['empty', 'empty', 'empty', 'completely empty', 'completely, gloriously empty'],
    vi: 'rỗng',
  },
  'search.builder.effectivePattern': {
    en: ['Effective pattern: {pattern}', 'Effective pattern: {pattern}', 'The pattern that will run: {pattern}', 'The pattern that will actually run: {pattern}', 'The pattern that will actually be unleashed: {pattern}'],
    vi: 'Mẫu sẽ được chạy: {pattern}',
  },
  'search.builder.patternValid': {
    en: ['{pattern} with flags {flags} is valid.', '{pattern} with flags {flags} is valid.', '{pattern} with flags {flags} is good.', '{pattern} with flags {flags} is good to go.', '{pattern} with flags {flags} is in perfect health.'],
    vi: '{pattern} với các cờ {flags} hợp lệ.',
  },
  'search.builder.patternError': {
    en: ['The pattern is not valid: {error}', 'The pattern is not valid: {error}', 'That pattern does not work: {error}', 'That pattern is broken: {error}', 'That pattern is a shambles, and here is why: {error}'],
    vi: 'Mẫu này không dùng được: {error}',
  },
  'search.builder.patternUnknownError': {
    en: ['The pattern is not valid.', 'The pattern is not valid.', 'That pattern does not work, and it will not say why.', 'That pattern is broken, and it will not say why.', 'That pattern is broken, and it refuses point blank to say why.'],
    vi: 'Mẫu này không dùng được, và nó không chịu nói vì sao.',
  },
  'search.builder.insert': {
    en: ['Insert', 'Insert', 'Insert it', 'Drop it in', 'Drop it into the pattern'],
    vi: 'Chèn vào',
  },
  'search.builder.insertLiteral': {
    en: ['Insert as literal text', 'Insert as literal text', 'Insert it as literal text, escaped', 'Insert it as literal text, escaped for you', 'Insert it as literal text, escaped for you, no surprises'],
    vi: 'Chèn dưới dạng văn bản nguyên văn, đã thoát ký tự',
  },
  'search.builder.copy': {
    en: ['Copy the pattern', 'Copy the pattern', 'Copy the pattern', 'Grab a copy of the pattern', 'Take a copy of this fine pattern'],
    vi: 'Sao chép mẫu',
  },
  'search.builder.copied': {
    en: ['Copied {pattern}.', 'Copied {pattern}.', 'Copied {pattern}.', '{pattern} is on your clipboard.', '{pattern} now lives in your clipboard.'],
    vi: 'Đã chép {pattern}.',
  },
  'search.builder.copyFailed': {
    en: ['The clipboard refused {pattern}.', 'The clipboard refused {pattern}.', 'The clipboard would not take {pattern}.', 'The clipboard would not take {pattern}, so select it and copy it yourself.', 'The clipboard turned its nose up at {pattern}. Select it and copy it yourself.'],
    vi: 'Bộ nhớ tạm không nhận {pattern}.',
  },
  'search.builder.pieces': {
    en: ['Pattern pieces', 'Pattern pieces', 'The pattern pieces', 'The pieces you can add', 'Every piece you can drop into the pattern'],
    vi: 'Các mảnh ghép của mẫu',
  },
  'search.builder.pieceDigit': {
    en: ['A digit', 'A digit', 'A digit', 'A digit, zero to nine', 'A digit, zero through nine, no exceptions'],
    vi: 'Một chữ số',
  },
  'search.builder.pieceWord': {
    en: ['A word character', 'A word character', 'A word character', 'A letter, digit or underscore', 'A letter, a digit or a humble underscore'],
    vi: 'Một ký tự chữ',
  },
  'search.builder.pieceLetters': {
    en: ['A letter', 'A letter', 'Any letter', 'Any letter, upper or lower', 'Any letter at all, upper case or lower'],
    vi: 'Một chữ cái bất kỳ',
  },
  'search.builder.pieceAny': {
    en: ['Any character', 'Any character', 'Any character at all', 'Any character at all', 'Absolutely any character at all'],
    vi: 'Bất kỳ ký tự nào',
  },
  'search.builder.pieceGroup': {
    en: ['Group', 'Group', 'Group', 'Group them together', 'Bundle them together as one'],
    vi: 'Nhóm',
  },
  'search.builder.pieceAlternation': {
    en: ['Either or', 'Either or', 'This or that', 'This one or that one', 'This one, or that one — the pattern will not mind'],
    vi: 'Cái này hoặc cái kia',
  },
  'search.builder.pieceOptional': {
    en: ['Once or not at all', 'Once or not at all', 'Once, or not at all', 'Once, or not at all', 'Once, or not at all — no pressure'],
    vi: 'Một lần, hoặc không lần nào',
  },
  'search.builder.pieceOneOrMore': {
    en: ['One or more', 'One or more', 'One or more', 'At least one', 'At least one, and as many as it likes'],
    vi: 'Một hoặc nhiều lần',
  },
  'search.builder.pieceZeroOrMore': {
    en: ['Zero or more', 'Zero or more', 'Any number, including none', 'Any number at all, including none', 'Any number at all, none very much included'],
    vi: 'Bao nhiêu lần cũng được, kể cả không',
  },
  'search.builder.startAnchor': {
    en: ['Start of text', 'Start of text', 'Start of the text', 'Right at the start', 'Right at the very start, and nowhere else'],
    vi: 'Đầu văn bản',
  },
  'search.builder.endAnchor': {
    en: ['End of text', 'End of text', 'End of the text', 'Right at the end', 'Right at the very end, and nowhere else'],
    vi: 'Cuối văn bản',
  },
  'search.builder.wholeWord': {
    en: ['Whole words only', 'Whole words only', 'Whole words only', 'Whole words only, no fragments', 'Whole words only. Fragments need not apply.'],
    vi: 'Chỉ khớp nguyên từ',
  },
  'search.builder.caseSensitive': {
    en: ['Match case', 'Match case', 'Match upper and lower case', 'Match upper and lower case exactly', 'Match upper and lower case exactly, to the letter'],
    vi: 'Phân biệt chữ hoa, chữ thường',
  },
  'search.builder.multiline': {
    en: ['Multiline anchors', 'Multiline anchors', 'Anchors match each line', 'Anchors match each line, not just the whole text', 'Anchors bite at each line, not just the whole text'],
    vi: 'Neo khớp theo từng dòng',
  },
  'search.builder.unicode': {
    en: ['Unicode', 'Unicode', 'Full Unicode', 'Full Unicode, emoji and all', 'Full Unicode, emoji, accents and all'],
    vi: 'Unicode đầy đủ',
  },

  // ---- the notification stack, the title bar and the tab strip ------------

  'notify.stackLabel': {
    en: ['Notifications', 'Notifications', 'Notifications', 'Notifications', 'Notifications, stacked politely'],
    vi: 'Thông báo',
  },
  'notify.queued': {
    en: ['{count} more waiting.', '{count} more waiting.', '{count} more are waiting their turn.', '{count} more are waiting their turn, patiently.', '{count} more are queueing up, patiently, like a very British bus stop.'],
    vi: 'Còn {count} thông báo đang chờ đến lượt.',
  },
  'notify.progressBusy': {
    en: ['Working…', 'Working…', 'Working on it…', 'Working on it, hold tight…', 'Working on it, hold tight, do not touch anything…'],
    vi: 'Đang xử lý…',
  },
  'notify.progressPercent': {
    en: ['{percent}%', '{percent}%', '{percent}%', '{percent}% of the way there', '{percent}% of the way there and going strong'],
    vi: '{percent}%',
  },
  'notify.confirm.ok': {
    en: ['Confirm', 'Confirm', 'Yes, do it', 'Yes, do it', 'Yes. Do it.'],
    vi: 'Vâng, làm đi',
  },
  'notify.confirm.cancel': {
    en: ['Cancel', 'Cancel', 'Never mind', 'Nope, back out', 'Abort the whole affair'],
    vi: 'Thôi',
  },
  'notify.confirm.destructiveHint': {
    en: ['{action} cannot be undone.', '{action} cannot be undone.', 'There is no undo for {action}.', 'There is no undo for {action}, none at all.', 'There is no undo for {action}. No backup, no second chance, no kindly stranger.'],
    vi: 'Không hoàn tác được {action}.',
  },
  'titlebar.wordmark': {
    en: ['Sprout Hollow', 'Sprout Hollow', 'Sprout Hollow', 'Sprout Hollow', 'Sprout Hollow'],
    vi: 'Sprout Hollow',
  },
  'tabs.panel.empty': {
    en: ['{title} has nothing in it yet.', '{title} has nothing in it yet.', '{title} is empty for now.', '{title} is empty for now. Give it a moment.', '{title} is empty for now, and rather enjoying the peace.'],
    vi: '{title} hiện đang trống.',
  },
  'tabs.move.blocked': {
    en: ['{title} cannot move from there.', '{title} cannot move from there.', '{title} cannot move from there.', '{title} will not budge from there.', '{title} will not budge from there, and it has its reasons.'],
    vi: '{title} không thể di chuyển từ đó.',
  },
  'surprise.panel.hint': {
    en: [
      'Every piece is drawn from code. Nothing is downloaded.',
      'Every piece is drawn from code. Nothing is downloaded.',
      'Every piece is drawn from code — nothing here was downloaded.',
      'Every piece is drawn from code. Nothing here was downloaded, or ever will be.',
      'Every piece is drawn from code, by hand. Nothing here was downloaded, or ever will be, not even the tea.',
    ],
    vi: 'Mọi mảnh ghép đều được vẽ từ mã — không có gì ở đây được tải xuống.',
  },
} as const

// ===========================================================================
// ALIASES — a second published name for a key that already exists above.
// One line each, and the two can never drift apart because they are the
// same object. Added because sibling lanes settled on their own key names.
// ===========================================================================

const ALIASES = {
  'settings.subtitle': CORE['settings.desc'],
  'settings.common.cancel': CORE['common.cancel'],
  'settings.common.on': CORE['common.on'],
  'settings.common.off': CORE['common.off'],
  'settings.language.mode': CORE['settings.lang.mode.label'],
  'settings.language.mode.desc': CORE['settings.lang.mode.desc'],
  'settings.motion.mode': CORE['settings.motion.label'],
  'settings.scale.level': CORE['settings.scale.label'],
  'settings.audio.mute': CORE['settings.audio.mute.label'],
  'settings.audio.test.action': CORE['settings.audio.test'],
  'settings.appearance.resetAll': CORE['appearance.resetAll'],
  'settings.data.export': CORE['settings.data.export.label'],
  'settings.data.import': CORE['settings.data.import.label'],
  'settings.data.clearHistory': CORE['history.clear'],
  'settings.data.resetAll': CORE['settings.data.reset.label'],
  'settings.data.resetAll.desc': CORE['settings.data.reset.desc'],
  'settings.data.resetAll.confirmTitle': CORE['settings.data.reset.confirm.title'],
  'settings.data.resetAll.confirmBody': CORE['settings.data.reset.confirm.body'],
  'settings.data.resetAll.done': CORE['settings.data.reset.done'],
  'settings.search.label': CORE['search.settings.label'],
  'settings.search.clear': CORE['search.clear'],
  'settings.search.focus': CORE['search.settings.label'],
  'settings.search.regexToggle': CORE['search.mode.regex'],
  'settings.search.literal': CORE['regex.piece.literal'],
  'settings.search.pattern': CORE['regex.pattern.label'],
  'settings.search.flags': CORE['regex.flags.label'],
  'settings.search.flag.i': CORE['regex.flag.i'],
  'settings.search.flag.m': CORE['regex.flag.m'],
  'settings.search.flag.s': CORE['regex.flag.s'],
  'settings.search.flag.u': CORE['regex.flag.u'],
  'settings.search.copy': CORE['regex.copy'],
  'settings.search.builderTitle': CORE['regex.title'],
  'settings.search.builderToggle': CORE['search.builder.open'],
  'settings.search.token.digit': CORE['regex.piece.digit'],
  'settings.search.token.word': CORE['regex.piece.word'],
  'settings.search.token.space': CORE['regex.piece.space'],
  'settings.search.token.any': CORE['regex.piece.any'],
  'settings.search.token.class': CORE['regex.piece.charclass'],
  'settings.search.token.start': CORE['regex.piece.anchor.start'],
  'settings.search.token.end': CORE['regex.piece.anchor.end'],
  'settings.search.token.wordBoundary': CORE['regex.piece.wordboundary'],
  'settings.search.token.group': CORE['regex.piece.capture'],
  'settings.search.token.alternate': CORE['regex.piece.alternation'],
  'settings.search.token.optional': CORE['regex.quantifier.optional'],
  'settings.search.token.oneOrMore': CORE['regex.quantifier.some'],
  'settings.search.token.anyCount': CORE['regex.quantifier.any'],
  'surprise.description': CORE['surprise.desc'],
  'settings.search': CORE['search.settings.label'],
  'titlebar.minimize': CORE['titlebar.minimise'],
  'titlebar.maximize': CORE['titlebar.maximise'],
} as const

/**
 * The whole catalogue: core entries, the lane-specific extras, and the aliases.
 * `satisfies` proves every entry has English at all five levels and a Vietnamese line.
 */
export const STRINGS = { ...CORE, ...EXTRA, ...ALIASES } as const satisfies Record<
  string,
  StringEntry
>

/** Every key in the catalogue. Other lanes get a compile error for a typo. */
export type StringKey = keyof typeof STRINGS
