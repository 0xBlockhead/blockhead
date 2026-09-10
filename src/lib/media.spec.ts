import { describe, expect, it } from 'vitest'

import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaUrlCases, rejectedMediaUrls } from '../../tests/mediaCases.ts'

describe('resolveMediaUrlTransport', () => {
	it.each(mediaUrlCases)('normalizes %s', (input, url, transport) => {
		expect(resolveMediaUrlTransport(input)).toEqual({ url, transport })
	})

	it.each(rejectedMediaUrls)('rejects unsupported input %j', (input) => {
		expect(resolveMediaUrlTransport(input)).toBeUndefined()
	})
})
