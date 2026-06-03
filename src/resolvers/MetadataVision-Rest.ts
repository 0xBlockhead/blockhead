import { mediaFromUrl } from '$/lib/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { defineEntityResolver } from '$/resolvers/$resolvers.ts'
import { schema } from '$/schema/index.ts'
import type { EntityFieldValues } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	source: Source.MetadataVision_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Url,
			resolve: async (entityId) => {
				const { getOpenGraphWireForPublicHttpUrl } = await import('$/sources/MetadataVision/Rest/queries.ts')
				try {
					const wire = await getOpenGraphWireForPublicHttpUrl(entityId.url)
					const title = optionalNonemptyString(wire.title)
					const description = optionalNonemptyString(wire.description)
					const publisher = optionalNonemptyString(wire.publisher ?? wire.author)
					const imageUrl = optionalNonemptyString(wire.image)
					const logoUrl = optionalNonemptyString(wire.logo)
					const imageMedia = (
						imageUrl == null ?
							undefined
						:
							mediaFromUrl(imageUrl, MediaType.Image)
					)
					const siteIconMedia = (
						logoUrl == null ?
							undefined
						:
							mediaFromUrl(logoUrl, MediaType.Image)
					)
					const out: Partial<EntityFieldValues<typeof schema, EntityType.Url>> = {}
					if (title != null) out.openGraphTitle = title
					if (description != null) out.openGraphDescription = description
					if (publisher != null) out.publisher = publisher
					if (imageMedia != null) out.$openGraphImage = imageMedia
					if (siteIconMedia != null) out.$siteIcon = siteIconMedia
					return out
				}
				catch (error) {
					throw new Error(
						`MetadataVision_Rest: Open Graph fetch failed for ${entityId.url}`,
						{ cause: error },
					)
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
