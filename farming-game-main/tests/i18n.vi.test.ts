/**
 * Vietnamese is a partial, single-voice catalogue layered over English. These tests keep
 * it honest: every key exists, every placeholder survives translation, and an untranslated
 * key falls back to English instead of going blank.
 */
import { afterEach, describe, expect, it } from 'vitest'

import { STRINGS, placeholdersOf } from '../src/shell/core/strings'
import type { StringEntry } from '../src/shell/core/strings'
import { VI } from '../src/shell/core/strings.vi'
import { getLang, setFunny, setLang, t } from '../src/shell/core/i18n'
import type { StringKey } from '../src/shell/core/i18n'

const CATALOGUE = STRINGS as Readonly<Record<string, StringEntry>>

describe('Vietnamese catalogue', () => {
  afterEach(() => {
    setLang('en')
    setFunny({ en: 2 })
  })

  it('only translates keys that exist in the catalogue', () => {
    for (const key of Object.keys(VI)) {
      expect(Object.prototype.hasOwnProperty.call(CATALOGUE, key), key).toBe(true)
    }
  })

  it('keeps exactly the same {parameter} set as the English text', () => {
    for (const [key, text] of Object.entries(VI)) {
      const english = CATALOGUE[key].en[0]
      expect(placeholdersOf(text as string), key).toEqual(placeholdersOf(english))
    }
  })

  it('has no empty translations', () => {
    for (const [key, text] of Object.entries(VI)) {
      expect((text as string).trim().length, key).toBeGreaterThan(0)
    }
  })

  it('translates and interpolates when the language is vi', () => {
    setLang('vi')
    expect(getLang()).toBe('vi')
    expect(t('common.cancel')).toBe('Hủy')
    expect(t('common.more', { count: 4 })).toBe('Còn 4 mục nữa')
    expect(t('season.fall')).toBe('Thu')
  })

  it('ignores the funny level for translated keys', () => {
    setLang('vi')
    setFunny({ en: 1 })
    const low = t('tool.axe')
    setFunny({ en: 5 })
    expect(t('tool.axe')).toBe(low)
  })

  it('falls back to English for a key with no Vietnamese entry', () => {
    const untranslated = (Object.keys(CATALOGUE) as StringKey[]).find(
      (key) => !Object.prototype.hasOwnProperty.call(VI, key),
    )
    expect(untranslated).toBeDefined()
    setLang('en')
    const english = t(untranslated as StringKey)
    setLang('vi')
    expect(t(untranslated as StringKey)).toBe(english)
  })

  it('still returns the key itself for an unknown key', () => {
    setLang('vi')
    expect(t('no.such.key' as StringKey)).toBe('no.such.key')
  })
})
