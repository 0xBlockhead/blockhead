import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { mediaFromUrl } from '$/lib/media.ts'
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
				const { swarmOnlyReferencePattern } = await import('$/sources/Swarm/Rest/constants.ts')
				const normalizedReference = (
					(await import('$/sources/Swarm/Rest/queries.ts')).normalizeReference(entityId.reference)
				)
				if (!swarmOnlyReferencePattern.test(normalizedReference)) {
					throw new Error(`Swarm_Rest: invalid reference ${entityId.reference}`)
				}
				const {
					fetchBrowseResult,
					getResourceCanonicalUri,
				} = await import('$/sources/Swarm/Rest/queries.ts')
				let browseResult
				try {
					browseResult = await fetchBrowseResult({
						reference: entityId.reference,
						contentPath: entityId.contentPath,
					})
				} catch (error) {
					throw new Error(
						`Swarm_Rest: unable to load bzz://${entityId.reference}${entityId.contentPath ? `/${entityId.contentPath}` : ''}`,
						{ cause: error },
					)
				}
				const mediaEntity = ((
					type,
				) => (
					browseResult.displayType === 'image'
					|| browseResult.displayType === 'video'
					|| browseResult.displayType === 'audio' ?
						((media) => (
							media == null ?
								undefined
							:
								{
									...media,
									$original: {
										[EntityMetaKey.Id]: {
											url: browseResult.gatewayUrl,
										},
										...(browseResult.contentType != null && { mimeType: browseResult.contentType }),
										...(browseResult.contentLength != null && { size: browseResult.contentLength }),
									},
								}
						))(mediaFromUrl(browseResult.gatewayUrl, type))
					:
						undefined
				))(
					browseResult.displayType === 'image' ?
						MediaType.Image
					: browseResult.displayType === 'video' ?
						MediaType.Video
					:
						MediaType.Audio,
				)

				return {
					canonicalUri: getResourceCanonicalUri({
						reference: browseResult.reference,
						contentPath: browseResult.contentPath,
					}),
					gatewayOrigin: browseResult.gatewayOrigin,
					gatewayUrl: browseResult.gatewayUrl,
					fileName: browseResult.fileName,
					extension: browseResult.extension,
					...(browseResult.contentType != null && { contentType: browseResult.contentType }),
					...(browseResult.contentLength != null && { contentLength: browseResult.contentLength }),
					displayType: browseResult.displayType,
					isContentTypeInferred: browseResult.isContentTypeInferred,
					...(browseResult.text != null && { text: browseResult.text }),
					...(mediaEntity != null && { $media: mediaEntity }),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
