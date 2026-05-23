import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { decodeIpfsCid } from '$/lib/multiformats.ts'
import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Ipfs_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.IpfsResource,
			resolve: async (entityId) => {
				if (entityId.namespace !== 'ipfs' && entityId.namespace !== 'ipns') {
					throw new Error(`Ipfs_Rest: unsupported namespace ${entityId.namespace}`)
				}
				const { fetchIpfsBrowseResult } = await import('$/sources/Ipfs/Rest/queries.ts')
				const browseResult = await fetchIpfsBrowseResult({
					namespace: entityId.namespace,
					target: entityId.target,
					contentPath: entityId.contentPath,
				})
				const decodedCid = (
					browseResult.namespace === 'ipfs' ?
						decodeIpfsCid(browseResult.target)
					:
						null
				)
				const mediaEntity = ((
					type,
				) => (
					browseResult.displayType === 'image'
					|| browseResult.displayType === 'video'
					|| browseResult.displayType === 'audio' ?
						((media) => (
							media == null ?
								undefined
							:	{
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
					canonicalUri: ipfsResourceCanonicalUri({
						namespace: browseResult.namespace,
						target: browseResult.target,
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
					...(decodedCid != null && {
							cidVersion: decodedCid.version,
							cidMultibase: decodedCid.multibase,
							cidMulticodecCode: decodedCid.multicodecCode,
							cidMultihashCode: decodedCid.multihashCode,
							cidMultihashDigestHex: decodedCid.multihashDigestHex,
							isCidSubdomainSafe: decodedCid.isSubdomainSafe,
						}),
					...(mediaEntity != null && { $media: mediaEntity }),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
