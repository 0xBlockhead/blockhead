import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Swarm_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.SwarmResource,
			resolve: {
				ResourceAddress: {
					resolve: async ({ contentPath, reference }) => {
						const { assertSwarmGatewayReference, fetchBrowseResult } = await import('$/sources/Swarm/Rest/queries.ts')
						const normalizedReference = assertSwarmGatewayReference(reference)
						let browseResult
						try {
							browseResult = await fetchBrowseResult({
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

		defineResolver({
			entityType: EntityType._GlobalSwarmAccess,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => {
						if (scope !== '_GlobalSwarmAccess')
							throw new Error(`Swarm_Rest: unsupported scope ${scope}`)

						const {
							getGatewayReachability,
							listSeededExampleResources,
						} = await import('$/sources/Swarm/Rest/queries.ts')
						const reachability = await getGatewayReachability()
						const seededExamples = listSeededExampleResources()
						const timestampMs = Date.now()
						const seededExampleCount = seededExamples.length

						return {
							scope,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$hub: { scope },
										timestampMs,
										source: Source.Swarm_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'declaredAccessEndpointCount')]:
											reachability.declaredAccessEndpointCount,
										[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'reachableAccessEndpointCount')]:
											reachability.reachableAccessEndpointCount,
										[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'reachable')]:
											reachability.reachable,
										[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'observedResourceCount')]:
											seededExampleCount,
										[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'seededExampleCount')]:
											seededExampleCount,
									},
								},
							],
							$$observedResources: seededExamples.map((resource) => ({
								[EntityMetaKey.Selector]: resource,
							})),
						}
					},
				},
			},
		})({
			scope: (hub) => hub.scope,
			$$timestamps: {
				select: (hub) => hub.$$timestamps,
				resolveCount: (hub) => hub.$$timestamps.length,
			},
			$$observedResources: {
				select: (hub) => hub.$$observedResources,
				resolveCount: (hub) => hub.$$observedResources.length,
			},
		}),

		defineResolver({
			entityType: EntityType._GlobalSwarmAccess_Timestamp,
			resolve: {
				HubTimestampMsSource: {
					resolve: async ({
						$hub,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Swarm_Rest)
							throw new Error(`Swarm_Rest: unsupported source ${source}`)

						const {
							getGatewayReachability,
							listSeededExampleResources,
						} = await import('$/sources/Swarm/Rest/queries.ts')
						const seededExampleCount = listSeededExampleResources().length

						return {
							$hub,
							timestampMs,
							source,
							...(await getGatewayReachability()),
							observedResourceCount: seededExampleCount,
							seededExampleCount,
						}
					},
				},
			},
		})({
			$hub: (snapshot) => ({
				[EntityMetaKey.Selector]: snapshot.$hub,
			}),
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			declaredAccessEndpointCount: (snapshot) => snapshot.declaredAccessEndpointCount,
			reachableAccessEndpointCount: (snapshot) => snapshot.reachableAccessEndpointCount,
			observedResourceCount: (snapshot) => snapshot.observedResourceCount,
			seededExampleCount: (snapshot) => snapshot.seededExampleCount,
			reachable: (snapshot) => snapshot.reachable,
		}),
	],
} satisfies RegisteredSourceResolverModule
