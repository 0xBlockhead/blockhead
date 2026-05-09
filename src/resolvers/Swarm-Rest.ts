import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Swarm_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SwarmResource,
			resolve: async (entityId) => {
				const {
					fetchSwarmBrowseResult,
					swarmResourceCanonicalUri,
				} = await import('$/sources/Swarm/Rest/queries.ts')
				const browseResult = await fetchSwarmBrowseResult({
					reference: entityId.reference,
					contentPath: entityId.contentPath,
				})
				const mediaEntity = (
					browseResult.displayType === 'image'
					|| browseResult.displayType === 'video'
					|| browseResult.displayType === 'audio' ?
						{
							[EntityMetaKey.Id]: {
								url: browseResult.gatewayUrl,
							},
							type: (
								browseResult.displayType === 'image' ?
									MediaType.Image
								: browseResult.displayType === 'video' ?
									MediaType.Video
								:
									MediaType.Audio
							),
							$original: {
								[EntityMetaKey.Id]: {
									url: browseResult.gatewayUrl,
								},
								...(browseResult.contentType != null ?
									{ mimeType: browseResult.contentType }
								:
									{}),
								...(browseResult.contentLength != null ?
									{ size: browseResult.contentLength }
								:
									{}),
							},
						}
					:
						undefined
				)

				return {
					canonicalUri: swarmResourceCanonicalUri({
						reference: browseResult.reference,
						contentPath: browseResult.contentPath,
					}),
					gatewayOrigin: browseResult.gatewayOrigin,
					gatewayUrl: browseResult.gatewayUrl,
					fileName: browseResult.fileName,
					extension: browseResult.extension,
					...(browseResult.contentType != null ?
						{ contentType: browseResult.contentType }
					:
						{}),
					...(browseResult.contentLength != null ?
						{ contentLength: browseResult.contentLength }
					:
						{}),
					displayType: browseResult.displayType,
					isContentTypeInferred: browseResult.isContentTypeInferred,
					...(browseResult.text != null ?
						{ text: browseResult.text }
					:
						{}),
					...(mediaEntity != null ?
						{ $media: mediaEntity }
					:
						{}),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
