/**
 * Vietnamese catalogue (Tiếng Việt).
 *
 * A PARTIAL map: one string per key, no funny levels. Any key missing here falls back to
 * English (see `viVoice` in i18n.ts), so translating is incremental — add keys whenever
 * you like, the game never shows a blank label.
 *
 * Rules:
 *   - The key must exist in `strings.ts` (typos are compile errors via `StringKey`).
 *   - Keep exactly the same `{placeholder}` set as the English text (`tests/i18n.test.ts`
 *     checks this). Translate the words around a placeholder, never the placeholder.
 *   - No imports except types, so a plain script can read this file.
 *
 * To find what is left to translate, compare `availableKeys()` with `Object.keys(VI)`.
 */
import type { StringKey } from './strings'

export const VI: Readonly<Partial<Record<StringKey, string>>> = {
  // ---- common ---------------------------------------------------------------
  'common.ok': 'OK',
  'common.cancel': 'Hủy',
  'common.close': 'Đóng',
  'common.save': 'Lưu',
  'common.apply': 'Áp dụng',
  'common.reset': 'Đặt lại',
  'common.yes': 'Có',
  'common.no': 'Không',
  'common.search': 'Tìm kiếm',
  'common.clear': 'Xóa',
  'common.copy': 'Sao chép',
  'common.copied': 'Đã sao chép',
  'common.none': 'Không có',
  'common.loading': 'Đang tải',
  'common.retry': 'Thử lại',
  'common.back': 'Quay lại',
  'common.more': 'Còn {count} mục nữa',

  // ---- language settings ----------------------------------------------------
  'settings.lang.mode.label': 'Ngôn ngữ',
  'settings.lang.option.vi': 'Tiếng Việt',
  'settings.lang.option.vi.desc': 'Tiếng Việt. Phần chưa dịch sẽ hiện bằng tiếng Anh.',
  'settings.lang.preview.label': 'Xem thử',
  'settings.lang.changed': 'Đã đổi ngôn ngữ sang {lang}.',

  // ---- seasons, weather, quality --------------------------------------------
  'season.spring': 'Xuân',
  'season.summer': 'Hạ',
  'season.fall': 'Thu',
  'season.winter': 'Đông',
  'weather.clear': 'Trời quang',
  'weather.rain': 'Mưa',
  'weather.storm': 'Bão',
  'weather.snow': 'Tuyết',
  'quality.normal': 'Thường',
  'quality.silver': 'Bạc',
  'quality.gold': 'Vàng',

  // ---- tools ----------------------------------------------------------------
  'tool.hoe': 'Cuốc',
  'tool.can': 'Bình tưới',
  'tool.seeds': 'Hạt giống',
  'tool.hand': 'Tay không',
  'tool.axe': 'Rìu',
  'tool.sprinkler': 'Vòi phun',
  'tool.fertilizer': 'Phân bón',
  'tool.hoe.desc': 'Biến cỏ thành đất canh tác.',
  'tool.can.desc': 'Tưới nước cho đất đã xới.',
  'tool.seeds.desc': 'Gieo loại hạt giống đang chọn.',
  'tool.hand.desc': 'Thu hoạch cây đã chín.',
  'tool.axe.desc': 'Dọn cỏ dại, đá và khúc gỗ.',
  'tool.sprinkler.desc': 'Mỗi đêm tưới nước cho các ô xung quanh.',
  'tool.fertilizer.desc': 'Bón cho đất đã xới trước khi gieo hạt.',
  'good.sprinkler': 'Vòi phun',
  'good.fertilizer': 'Phân bón',

  // ---- ground ---------------------------------------------------------------
  'ground.grass': 'Cỏ',
  'ground.soil': 'Đất đã xới',
  'ground.weeds': 'Cỏ dại',
  'ground.rock': 'Đá',
  'ground.log': 'Khúc gỗ',
  'ground.water': 'Ao',
  'ground.path': 'Lối đi',
  'item.seed': 'Hạt giống {crop}',
}
