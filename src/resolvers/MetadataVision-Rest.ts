import { optionalNonemptyString } from '$/lib/string.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import type { MetadataVisionOpenGraphData } from '$/sources/MetadataVision/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const urlPreviewTimestampFieldsFromWire = (
	wire: MetadataVisionOpenGraphData
) => {
	const title = optionalNonemptyString(wire.title)
	const description = optionalNonemptyString(wire.description)
	const siteName = optionalNonemptyString(wire.publisher ?? wire.author)
	const imageUrl = optionalNonemptyString(wire.image)
	const image = mediaFromUrl(imageUrl, MediaType.Image)

	return {
		...(title != null && {
			[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'title')]: title,
		}),
		...(description != null && {
			[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'description')]: description,
		}),
		...(siteName != null && {
			[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'siteName')]: siteName,
		}),
		...(imageUrl != null && {
			[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'imageUrl')]: imageUrl,
		}),
		...(image != null && {
			[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], '$image')]: image,
		}),
		[entityFieldAddressKey(EntityType.UrlPreview_Timestamp, [], 'previewStatus')]: 'ok',
	}
}

export default {
	source: Source.MetadataVision_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Url,
			resolve: {
				Url: {
					resolve: async ({ url }) => {
						const { getOpenGraphWireForPublicHttpUrl, metadataVisionBinding } = await import('$/sources/MetadataVision/Rest/queries.ts')
						const wire = await getOpenGraphWireForPublicHttpUrl(
							metadataVisionBinding,
							url
						)
						return {
							$$previewTimestamps: [
								{
									[EntityMetaKey.Selector]: {
										$url: { url },
										timestampMs: Date.now(),
										source: Source.MetadataVision_Rest,
									},
									[EntityMetaKey.Fields]: urlPreviewTimestampFieldsFromWire(wire),
								},
							],
						}
					},
				}
			},
		})({
			$$previewTimestamps: (snapshot) => snapshot.$$previewTimestamps,
		}),
	],
} satisfies RegisteredSourceResolverModule
