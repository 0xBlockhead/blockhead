import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { ipfsNamespaceFromString } from '$/lib/ipfs.ts'
import { canonicalIpfsCidString, decodeIpfsCid } from '$/lib/multiformats.ts'
import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { defineObservationTimeWriter } from '$/resolvers/observationTimeWriter.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const ipfsAccessTimestampWriter = defineObservationTimeWriter({
	entityType: EntityType._GlobalIpfsAccess_Timestamp,
	selectorName: 'HubTimestampMsSource',
	source: Source.Ipfs_Rest,
	provenance: 'LocalRefresh',
})

const ipfsResourceTimestampWriter = defineObservationTimeWriter({
	entityType: EntityType.IpfsResource_Timestamp,
	selectorName: 'ResourceTimestampMsSource',
	source: Source.Ipfs_Rest,
	provenance: 'HttpResponse',
})

export default {
	source: Source.Ipfs_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.IpfsResource,
			resolve: {
				ResourceAddress: {
					resolve: async ({ contentPath, namespace, target }) => {
						const { fetchBrowseResult } = await import('$/sources/Ipfs/Rest/queries.ts')
						const browseResult = await fetchBrowseResult({
							namespace: ipfsNamespaceFromString(namespace) ?? undefined,
							target: target,
							contentPath: contentPath,
						})
						// The source has finished reading and parsing the successful response.
						const timestampMs = Date.now()
						const canonicalTarget = (
							browseResult.namespace === 'ipfs' ?
								canonicalIpfsCidString(browseResult.target) ?? browseResult.target
							:
								browseResult.target
						)
						const decodedCid = (
							browseResult.namespace === 'ipfs' ?
								decodeIpfsCid(browseResult.target)
							:
								null
						)
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
							namespace: browseResult.namespace,
							target: canonicalTarget,
							contentPath: browseResult.contentPath,
							canonicalUri: ipfsResourceCanonicalUri({
								namespace: browseResult.namespace,
								target: browseResult.target,
								contentPath: browseResult.contentPath,
							}),
							$$timestamps: [
								ipfsResourceTimestampWriter.write({
									$resource: {
										namespace: browseResult.namespace,
										target: canonicalTarget,
										contentPath: browseResult.contentPath,
									},
									timestampMs,
									source: Source.Ipfs_Rest,
								}, {
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'gatewayOrigin')]: browseResult.gatewayOrigin,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'gatewayUrl')]: browseResult.gatewayUrl,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'fileName')]: browseResult.fileName,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'extension')]: browseResult.extension,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'contentType')]: browseResult.contentType,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'contentLength')]: browseResult.contentLength,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'displayType')]: browseResult.displayType,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'isContentTypeInferred')]: browseResult.isContentTypeInferred,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'text')]: browseResult.text,
									[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], '$media')]: mediaEntity,
								}),
							],
							...(decodedCid != null && {
								cidVersion: decodedCid.version,
								cidMultibase: decodedCid.multibase,
								cidMulticodecCode: decodedCid.multicodecCode,
								cidMultihashCode: decodedCid.multihashCode,
								cidMultihashDigestHex: decodedCid.multihashDigestHex,
								isCidSubdomainSafe: decodedCid.isSubdomainSafe,
							}),
						}
					},
				}
			},
		})({
				namespace: (snapshot) => snapshot.namespace,
				target: (snapshot) => snapshot.target,
				contentPath: (snapshot) => snapshot.contentPath,
				canonicalUri: (snapshot) => snapshot.canonicalUri,
				$$timestamps: {
					select: (snapshot) => snapshot.$$timestamps,
				},
				cidVersion: (snapshot) => snapshot.cidVersion,
				cidMultibase: (snapshot) => snapshot.cidMultibase,
				cidMulticodecCode: (snapshot) => snapshot.cidMulticodecCode,
				cidMultihashCode: (snapshot) => snapshot.cidMultihashCode,
				cidMultihashDigestHex: (snapshot) => snapshot.cidMultihashDigestHex,
				isCidSubdomainSafe: (snapshot) => snapshot.isCidSubdomainSafe,
			}),

		defineResolver({
			entityType: EntityType._GlobalIpfsAccess,
			resolve: {
				Scope: {
					resolve: async ({ scope }) => {
						const {
							getGatewayReachability,
							listSeededExampleResources,
						} = await import('$/sources/Ipfs/Rest/queries.ts')
						const reachability = await getGatewayReachability()
						const seededExamples = listSeededExampleResources()
						const timestampMs = Date.now()

						return {
							scope,
							$$timestamps: [
								ipfsAccessTimestampWriter.write({
									$hub: { scope },
									timestampMs,
									source: Source.Ipfs_Rest,
								}, {
									[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'declaredAccessEndpointCount')]:
										reachability.declaredAccessEndpointCount,
									[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'reachableAccessEndpointCount')]:
										reachability.reachableAccessEndpointCount,
									[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'reachable')]:
										reachability.reachable,
								}),
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
			},
			$$observedResources: {
				select: (hub) => hub.$$observedResources,
				resolveCount: (hub) => hub.$$observedResources.length,
			},
		}),

	],
} satisfies RegisteredSourceResolverModule
