import { expect, it } from 'vitest'

import { match } from '$/params/absoluteUrl.ts'

it('accepts encoded absolute URLs and rejects malformed segments', () => {
	expect(match('https%3A%2F%2Fmastodon.social')).toBe(true)
	expect(match('mastodon.social')).toBe(false)
	expect(match('%')).toBe(false)
})
