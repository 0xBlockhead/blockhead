import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { decodeIpfsCid } from '$/lib/multiformats.ts'
import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	source: 'Ipfs_Rest' satisfies import('$/sources/$Source.ts').Source,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.IpfsResource,
			resolve: async (entityId) => {
				const { fetchIpfsBrowseResult } = await import('$/sources/Ipfs/Rest/queries.ts')
				const browseResult = await fetchIpfsBrowseResult({
					namespace: entityId.namespace === 'ipfs' || entityId.namespace === 'ipns' ?
						entityId.namespace
					:
						undefined,
					target: entityId.target,
					contentPath: entityId.contentPath,
				})
				const decodedCid = (
					browseResult.namespace === 'ipfs' ?
						decodeIpfsCid(browseResult.target)
					:
						null
				)
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
					canonicalUri: ipfsResourceCanonicalUri({
						namespace: browseResult.namespace,
						target: browseResult.target,
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
					...(decodedCid != null ?
						{
							cidVersion: decodedCid.version,
							cidMultibase: decodedCid.multibase,
							cidMulticodecCode: decodedCid.multicodecCode,
							cidMultihashCode: decodedCid.multihashCode,
							cidMultihashDigestHex: decodedCid.multihashDigestHex,
							isCidSubdomainSafe: decodedCid.isSubdomainSafe,
						}
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
