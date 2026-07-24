import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { SwarmResourceSelector } from '$/schema/SwarmResource.ts'
import { _GlobalSwarmAccess_TimestampSelector } from '$/schema/_GlobalSwarmAccess_Timestamp.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const swarmBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Swarm_Rest
		&& binding.target.kind === SourceTargetKind.ContentAddressScheme
		&& binding.target.key === 'swarm'
	))

if (swarmBindings.length !== 1)
	throw new Error('Swarm_Rest: canonical gateway binding is missing or ambiguous')

const swarmBinding = swarmBindings[0]

export default {
	source: Source.Swarm_Rest,

	resolvers: [
		defineResolver(Source.Swarm_Rest, {
			entityType: EntityType.SwarmResource,
			resolve: {
				[SwarmResourceSelector.ResourceAddress]: {
					resolve: async ({ contentPath, reference }) => {
						const { swarmOnlyReferencePattern } = await import('$/sources/Swarm/Rest/constants.ts')
						const normalizedReference = (
							reference
								.trim()
								.replace(/^bzz:\/\//i, '')
								.replace(/^swarm:\/\//i, '')
								.replace(/^\/+|\/+$/g, '')
								.replace(/^0x/i, '')
						)
						if (!swarmOnlyReferencePattern.test(normalizedReference))
							throw new Error(`Swarm_Rest: invalid reference ${reference}`)
						const { fetchBrowseResult } = await import('$/sources/Swarm/Rest/queries.ts')
						let browseResult
						try {
							browseResult = await fetchBrowseResult({
								binding: swarmBinding,
								reference: normalizedReference,
								contentPath,
							})
						} catch (error) {
							throw new Error(
								`Swarm_Rest: unable to load bzz://${normalizedReference}${contentPath ? `/${contentPath}` : ''}`,
								{ cause: error }
							)
						}
						const mediaEntity = ((
							type
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
												[EntityMetaKey.Selector]: {
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
							:
								browseResult.displayType === 'video' ?
									MediaType.Video
								:
									MediaType.Audio
						)

						return {
							reference: normalizedReference,
							contentPath: browseResult.contentPath,
							canonicalUri: `bzz://${browseResult.reference}${browseResult.contentPath === '' ? '' : `/${browseResult.contentPath}`}`,
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
				}
			},
		})({
				reference: (snapshot) => snapshot.reference,
				contentPath: (snapshot) => snapshot.contentPath,
				canonicalUri: (snapshot) => snapshot.canonicalUri,
				gatewayOrigin: (snapshot) => snapshot.gatewayOrigin,
				gatewayUrl: (snapshot) => snapshot.gatewayUrl,
				fileName: (snapshot) => snapshot.fileName,
				extension: (snapshot) => snapshot.extension,
				contentType: (snapshot) => snapshot.contentType,
				contentLength: (snapshot) => snapshot.contentLength,
				displayType: (snapshot) => snapshot.displayType,
				isContentTypeInferred: (snapshot) => snapshot.isContentTypeInferred,
				text: (snapshot) => snapshot.text,
				$media: (snapshot) => snapshot.$media,
			}),

		defineResolver(Source.Swarm_Rest, {
			entityType: EntityType._GlobalSwarmAccess_Timestamp,
			resolve: {
				[_GlobalSwarmAccess_TimestampSelector.HubTimestampMsSource]: {
					resolve: async ({
						$hub,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Swarm_Rest)
							throw new Error(`Swarm_Rest: unsupported source ${source}`)

						return {
							$hub,
							timestampMs,
							source,
							...(await (
								await import('$/sources/Swarm/Rest/queries.ts')
							).getGatewayReachability({
								binding: swarmBinding,
							})),
						}
					},
				},
			},
		})({
			$hub: (snapshot) => snapshot.$hub,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			declaredAccessEndpointCount: (snapshot) => snapshot.declaredAccessEndpointCount,
			reachableAccessEndpointCount: (snapshot) => snapshot.reachableAccessEndpointCount,
			reachable: (snapshot) => snapshot.reachable,
		}),
	],
}
