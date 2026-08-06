/**
 * Arweave gateway REST resolvers: full blocks, network info timestamps, resource browse.
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api
 */
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { sourceEndpointOrigin } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Arweave/bindings.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type ArweaveNetworkId = EntitySelector<typeof schema, EntityType.ArweaveNetwork>

const arweaveSlugNetwork = {
	slug: 'arweave' as const,
}
const binding = bindings[Source.Arweave_Rest][0]

const assertArweaveNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'arweave')
		throw new Error('Arweave_Rest: unsupported network')
}

const assertArweaveNetworkHub = (network: ArweaveNetworkId) => {
	assertArweaveNetwork(network.$network)
}

const gatewayOrigin = () => {
	for (const endpoint of binding.endpoints) {
		const origin = sourceEndpointOrigin(endpoint)
		if (origin != null)
			return origin
	}
	throw new Error('Arweave_Rest: canonical gateway binding has no HTTP endpoints')
}

const arweaveCanonicalUri = (
	transactionId: string,
	contentPath: string
) => (
	contentPath === '' ?
		`ar://${transactionId}`
	:
		`ar://${transactionId}/${contentPath.replace(/^\/+/, '')}`
)

const bigintFromWire = (
	value: string | number | undefined
) => (
	value == null ?
		undefined
	:
		BigInt(String(value))
)

const mapBlockWire = (
	network: NetworkId,
	block: Awaited<ReturnType<typeof import('$/sources/Arweave/Rest/queries.ts').getBlockByHeight>>
) => ({
	$network: {
		[EntityMetaKey.Selector]: {
			$network: network,
		},
	},
	height: BigInt(block.height),
	indepHash: block.indep_hash,
	...(block.previous_block !== '' && {
		previousBlock: block.previous_block,
	}),
	timestampMs: block.timestamp * 1000,
	...(block.tx_root != null && block.tx_root !== '' && {
		transactionRoot: block.tx_root,
	}),
	...(block.wallet_list != null && block.wallet_list !== '' && {
		walletList: block.wallet_list,
	}),
	...(block.reward_addr != null && block.reward_addr !== '' && {
		rewardAddress: block.reward_addr,
	}),
	...(bigintFromWire(block.reward_pool) != null && {
		rewardPoolWinston: bigintFromWire(block.reward_pool),
	}),
	...(bigintFromWire(block.weave_size) != null && {
		weaveSizeBytes: bigintFromWire(block.weave_size),
	}),
	...(bigintFromWire(block.block_size) != null && {
		blockSizeBytes: bigintFromWire(block.block_size),
	}),
	...(bigintFromWire(block.cumulative_diff) != null && {
		cumulativeDiff: bigintFromWire(block.cumulative_diff),
	}),
	...(block.hash_list_merkle != null && block.hash_list_merkle !== '' && {
		hashListMerkle: block.hash_list_merkle,
	}),
	transactionCount: block.txs.length,
	transactions: block.txs.map((transactionId) => ({
		[EntityMetaKey.Selector]: {
			$network: {
				$network: network,
			},
			transactionId,
		},
	})),
})

export default {
	source: Source.Arweave_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.ArweaveNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertArweaveNetworkHub($network)
						if (source !== Source.Arweave_Rest)
							throw new Error(`Arweave_Rest: unsupported source ${source}`)

						const { getNetworkInfo } = await import('$/sources/Arweave/Rest/queries.ts')
						const info = await getNetworkInfo()
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							latestHeight: BigInt(info.height),
							latestBlockHash: info.current,
							currentBlockHash: info.current,
							networkId: info.network,
							peerCount: info.peers,
							queuedTransactionCount: info.queue_length,
							gatewayOrigin: gatewayOrigin(),
							reachable: true,
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			latestHeight: (timestamp) => timestamp.latestHeight,
			latestBlockHash: (timestamp) => timestamp.latestBlockHash,
			currentBlockHash: (timestamp) => timestamp.currentBlockHash,
			networkId: (timestamp) => timestamp.networkId,
			peerCount: (timestamp) => timestamp.peerCount,
			queuedTransactionCount: (timestamp) => timestamp.queuedTransactionCount,
			gatewayOrigin: (timestamp) => timestamp.gatewayOrigin,
			reachable: (timestamp) => timestamp.reachable,
		}),

		defineResolver({
			entityType: EntityType.ArweaveBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({
						$network,
						height,
					}) => {
						assertArweaveNetworkHub($network)
						if (height > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Arweave_Rest: block height exceeds safe integer range')

						const { getBlockByHeight } = await import('$/sources/Arweave/Rest/queries.ts')
						return mapBlockWire(
							$network.$network,
							await getBlockByHeight(Number(height))
						)
					},
				},
				NetworkIndepHash: {
					resolve: async ({
						$network,
						indepHash,
					}) => {
						assertArweaveNetworkHub($network)
						const { getBlockByHash } = await import('$/sources/Arweave/Rest/queries.ts')
						return mapBlockWire(
							$network.$network,
							await getBlockByHash(indepHash)
						)
					},
				},
			},
		})({
			$network: (block) => block.$network,
			height: (block) => block.height,
			indepHash: (block) => block.indepHash,
			previousBlock: (block) => block.previousBlock,
			timestampMs: (block) => block.timestampMs,
			transactionRoot: (block) => block.transactionRoot,
			walletList: (block) => block.walletList,
			rewardAddress: (block) => block.rewardAddress,
			rewardPoolWinston: (block) => block.rewardPoolWinston,
			weaveSizeBytes: (block) => block.weaveSizeBytes,
			blockSizeBytes: (block) => block.blockSizeBytes,
			cumulativeDiff: (block) => block.cumulativeDiff,
			hashListMerkle: (block) => block.hashListMerkle,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.transactions,
		}),

		defineResolver({
			entityType: EntityType.ArweaveResource,
			resolve: {
				TransactionIdContentPath: {
					resolve: async ({
						transactionId,
						contentPath,
					}) => {
						if (!/^[A-Za-z0-9_-]{43}$/.test(transactionId))
							throw new Error('Arweave_Rest: invalid transaction ID')
						if (contentPath.includes('://') || contentPath.includes('..'))
							throw new Error('Arweave_Rest: invalid content path')

						return {
							transactionId,
							contentPath,
							canonicalUri: arweaveCanonicalUri(transactionId, contentPath),
							$transaction: {
								[EntityMetaKey.Selector]: {
									$network: {
										$network: arweaveSlugNetwork,
									},
									transactionId,
								},
							},
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$resource: {
										transactionId,
										contentPath,
									},
									timestampMs: Date.now(),
									source: Source.Arweave_Rest,
								},
							}],
						}
					},
				},
			},
		})({
			transactionId: (resource) => resource.transactionId,
			contentPath: (resource) => resource.contentPath,
			canonicalUri: (resource) => resource.canonicalUri,
			$transaction: (resource) => resource.$transaction,
			$$timestamps: (resource) => resource.timestamps,
		}),

		defineResolver({
			entityType: EntityType.ArweaveResource_Timestamp,
			resolve: {
				ResourceTimestampMsSource: {
					resolve: async ({
						$resource,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Arweave_Rest)
							throw new Error(`Arweave_Rest: unsupported source ${source}`)

						const { fetchBrowseResult } = await import('$/sources/Arweave/Rest/queries.ts')
						let browseResult
						try {
							browseResult = await fetchBrowseResult({
								transactionId: $resource.transactionId,
								contentPath: $resource.contentPath,
							})
						} catch (error) {
							throw new Error(
								`Arweave_Rest: unable to load ${arweaveCanonicalUri($resource.transactionId, $resource.contentPath)}`,
								{
									cause: error,
								}
							)
						}

						if (browseResult.gatewayOrigin == null || browseResult.gatewayOrigin === '')
							throw new Error('Arweave_Rest: browse result missing gateway origin')

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
							: browseResult.displayType === 'video' ?
								MediaType.Video
							:
								MediaType.Audio
						)

						return {
							$resource: {
								[EntityMetaKey.Selector]: $resource,
							},
							timestampMs,
							source,
							gatewayOrigin: browseResult.gatewayOrigin,
							gatewayUrl: browseResult.gatewayUrl,
							reachable: true,
							...(browseResult.fileName != null && { fileName: browseResult.fileName }),
							...(browseResult.extension != null && { extension: browseResult.extension }),
							...(browseResult.contentType != null && { contentType: browseResult.contentType }),
							...(browseResult.contentLength != null && { contentLength: browseResult.contentLength }),
							...(browseResult.displayType != null && { displayType: browseResult.displayType }),
							...(browseResult.isContentTypeInferred != null && { isContentTypeInferred: browseResult.isContentTypeInferred }),
							...(browseResult.text != null && { text: browseResult.text }),
							...(mediaEntity != null && { $media: mediaEntity }),
						}
					},
				},
			},
		})({
			$resource: (observation) => observation.$resource,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			gatewayOrigin: (observation) => observation.gatewayOrigin,
			gatewayUrl: (observation) => observation.gatewayUrl,
			reachable: (observation) => observation.reachable,
			fileName: (observation) => observation.fileName,
			extension: (observation) => observation.extension,
			contentType: (observation) => observation.contentType,
			contentLength: (observation) => observation.contentLength,
			displayType: (observation) => observation.displayType,
			isContentTypeInferred: (observation) => observation.isContentTypeInferred,
			text: (observation) => observation.text,
			$media: (observation) => observation.$media,
		}),
	],
} satisfies RegisteredSourceResolverModule
