import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { canonicalIpfsCidString, decodeIpfsCid } from '$/lib/multiformats.ts'
import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Ipfs_Rest,

	resolvers: [
		defineResolver(Source.Ipfs_Rest, {
			entityType: EntityType.IpfsResource,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBrowseResult } = await import('$/sources/Ipfs/Rest/queries.ts')
				const browseResult = await fetchBrowseResult({
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
					namespace: browseResult.namespace,
					target: (
						browseResult.namespace === 'ipfs' ?
							canonicalIpfsCidString(browseResult.target) ?? browseResult.target
						:
							browseResult.target
					),
					contentPath: browseResult.contentPath,
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
			}
			}
		})({
				fields: {
			namespace: (snapshot) => snapshot.namespace,
			target: (snapshot) => snapshot.target,
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
			cidVersion: (snapshot) => snapshot.cidVersion,
			cidMultibase: (snapshot) => snapshot.cidMultibase,
			cidMulticodecCode: (snapshot) => snapshot.cidMulticodecCode,
			cidMultihashCode: (snapshot) => snapshot.cidMultihashCode,
			cidMultihashDigestHex: (snapshot) => snapshot.cidMultihashDigestHex,
			isCidSubdomainSafe: (snapshot) => snapshot.isCidSubdomainSafe,
			$media: (snapshot) => snapshot.$media,
		},
			}),
	],
}
