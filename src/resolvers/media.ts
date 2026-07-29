import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'

export const mediaFromUrl = <_MediaType extends MediaType>(
	url: string | null | undefined,
	type: _MediaType
) => (
	((resolved) => (
		resolved == null ?
			undefined
		:
			{
				[EntityMetaKey.Selector]: { url: resolved.url },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Media, [], 'type')]: type,
					[entityFieldAddressKey(EntityType.Media, [], 'transport')]: resolved.transport,
				},
			}
	))(resolveMediaUrlTransport(url))
)
