import {
	describe,
	expect,
	it,
} from 'vitest'

import { MediaTransport } from '$/schema/MediaTransport.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'

describe('mediaFromUrl', () => {
	it('builds media entity field values from normalized media URLs', () => {
		expect(mediaFromUrl('ipfs://bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/image.png', MediaType.Image)).toEqual({
			[EntityMetaKey.Selector]: {
				url: 'https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76f7lz4gf5o7vsvixd3rqfwxq6c6azp7j7m/image.png',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
				[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Ipfs,
			},
		})
	})

	it('omits invalid media URLs', () => {
		expect(mediaFromUrl('not-a-media-url', MediaType.Image)).toBeUndefined()
	})
})
