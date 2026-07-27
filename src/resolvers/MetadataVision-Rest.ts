import { mediaFromUrl } from '$/resolvers/media.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { MetadataVisionOpenGraphData } from '$/sources/MetadataVision/Rest/types.ts'

const urlPreviewFieldsFromWire = (
	wire: MetadataVisionOpenGraphData
) => {
	const title = optionalNonemptyString(wire.title)
	const description = optionalNonemptyString(wire.description)
	const siteName = optionalNonemptyString(wire.publisher ?? wire.author)
	const imageUrl = optionalNonemptyString(wire.image)
	const image = mediaFromUrl(imageUrl, MediaType.Image)

	return {
		...(title != null && { title }),
		...(description != null && { description }),
		...(siteName != null && { siteName }),
		...(imageUrl != null && { imageUrl }),
		...(image != null && { $image: image }),
		previewStatus: 'ok',
	}
}

export default {
	source: Source.MetadataVision_Rest,

	resolvers: [
		defineResolver(Source.MetadataVision_Rest, {
			entityType: EntityType.Url,
			resolve: {
				Url: {
					resolve: async ({ url }) => {
						const { getOpenGraphWireForPublicHttpUrl } = await import('$/sources/MetadataVision/Rest/queries.ts')
						try {
							return {
								$$previewTimestamps: [
									{
										[EntityMetaKey.Selector]: {
											$url: { url },
											timestampMs: Date.now(),
											source: Source.MetadataVision_Rest,
										},
										...urlPreviewFieldsFromWire(
											await getOpenGraphWireForPublicHttpUrl(
												url
											)
										),
									},
								],
							}
						}
						catch (error) {
							throw new Error(
								`MetadataVision_Rest: Open Graph fetch failed for ${url}`,
								{ cause: error }
						)
						}
					},
				}
			},
		})({
				$$previewTimestamps: (snapshot) => snapshot.$$previewTimestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.MetadataVision_Rest, {
			entityType: EntityType.UrlPreview_Timestamp,
			resolve: {
				UrlTimestampMsSource: {
					resolve: async ({ $url, source }) => {
						if (source !== Source.MetadataVision_Rest)
							throw new Error(`MetadataVision_Rest: unsupported source ${source}`)

						const { getOpenGraphWireForPublicHttpUrl } = await import('$/sources/MetadataVision/Rest/queries.ts')
						return urlPreviewFieldsFromWire(
							await getOpenGraphWireForPublicHttpUrl(
								$url.url
							)
						)
					},
				}
			},
		})({
				title: (snapshot) => snapshot.title,
				description: (snapshot) => snapshot.description,
				siteName: (snapshot) => snapshot.siteName,
				imageUrl: (snapshot) => snapshot.imageUrl,
				$image: (snapshot) => snapshot.$image,
				previewStatus: (snapshot) => snapshot.previewStatus,
			}),
	],
}
