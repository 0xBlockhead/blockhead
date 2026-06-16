import { EntityMetaKey } from '$/schema/$schema.ts'
import { type MediaType } from '$/schema/Media.ts'
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
				type,
				transport: resolved.transport,
			}
	))(resolveMediaUrlTransport(url))
)
