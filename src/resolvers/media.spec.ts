import { describe, expect, it } from 'vitest'

import { MediaType } from '$/schema/MediaType.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { mediaUrlCases, rejectedMediaUrls } from '../../tests/mediaCases.ts'

describe('mediaFromUrl', () => {
	it.each(mediaUrlCases)('builds native media fields from %s', (input, url, transport) => {
		expect(mediaFromUrl(input, MediaType.Image)).toEqual({
			[EntityMetaKey.Selector]: { url },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
				[entityFieldAddressKey(EntityType.Media, [], 'transport')]: transport,
			},
		})
	})

	it.each([MediaType.Video, MediaType.Audio])('preserves requested %s type', (type) => {
		expect(mediaFromUrl(mediaUrlCases[0][0], type)?.[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.Media, [], 'type')
		]).toBe(type)
	})

	it.each(rejectedMediaUrls)('omits unsupported media input %j', (input) => {
		expect(mediaFromUrl(input, MediaType.Image)).toBeUndefined()
	})
})
