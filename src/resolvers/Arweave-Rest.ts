/**
 * Arweave gateway REST resolvers: network tip lists, full blocks, transactions, info timestamps, resource browse.
 * Global transaction / resource indexes stay on `Arweave_Graphql` (gateway REST has no listing API).
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api
 */
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	assertGatewayContentPath,
} from '$/sources/_shared/interfaces/ContentGateway/queries.ts'
import { ContentGatewayFamily } from '$/sources/_shared/interfaces/ContentGateway/types.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { ArweaveBlockWire } from '$/sources/Arweave/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type ArweaveNetworkId = EntitySelector<typeof schema, EntityType.ArweaveNetwork>
type ResolverContext = Parameters<typeof resolverContextRowLimit>[0]

const arweaveSlugNetwork = {
	slug: 'arweave' as const,
}

const assertArweaveNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'arweave')
		throw new Error('Arweave_Rest: unsupported network')
}

const assertArweaveNetworkHub = (network: ArweaveNetworkId) => {
	assertArweaveNetwork(network.$network)
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

const arweaveResourceTimestampFieldRowsFromBrowseResult = (
	browseResult: Awaited<ReturnType<typeof import('$/sources/Arweave/Rest/queries.ts')['fetchBrowseResult']>>
) => {
	const mediaEntity = ((
		type
	) => (
		browseResult.displayType === 'image'
		|| browseResult.displayType === 'video'
		|| browseResult.displayType === 'audio' ?
			mediaFromUrl(browseResult.gatewayUrl, type)
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
		[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'gatewayOrigin')]: browseResult.gatewayOrigin,
		[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'gatewayUrl')]: browseResult.gatewayUrl,
		[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'reachable')]: true as const,
		...(browseResult.fileName != null && {
			[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'fileName')]: browseResult.fileName,
		}),
		...(browseResult.extension != null && {
			[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'extension')]: browseResult.extension,
		}),
		...(browseResult.contentType != null && {
			[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'contentType')]: browseResult.contentType,
		}),
		[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'contentLength')]: browseResult.contentLength,
		[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'displayType')]: browseResult.displayType,
		[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'isContentTypeInferred')]: browseResult.isContentTypeInferred,
		...(browseResult.text != null && {
			[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], 'text')]: browseResult.text,
		}),
		...(mediaEntity != null && {
			[entityFieldAddressKey(EntityType.ArweaveResource_Timestamp, [], '$media')]: mediaEntity,
		}),
	}
}

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
	block: ArweaveBlockWire
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

const arweaveRestBlocksStartHeight = (
	tipHeight: number,
	context: ResolverContext
) => {
	if (
		context.providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
	)
		throw new Error('Arweave_Rest: invalid blocks continuation')

	const startHeight = context.providerContinuationToken == null ?
		tipHeight - (context.pagination.offset ?? 0)
	:
		Number(context.providerContinuationToken)

	if (!Number.isSafeInteger(startHeight))
		throw new Error('Arweave_Rest: invalid blocks continuation')

	if (startHeight > tipHeight)
		throw new Error('Arweave_Rest: blocks continuation exceeds tip')

	return startHeight
}

const arweaveRestBlockPageContinuation = (
	blocks: ReturnType<typeof blockEdgeRow>[]
) => {
	const lastHeight = blocks.at(-1)?.[EntityMetaKey.Selector].height
	return {
		operation: 'blocks',
		target: 'arweave',
		terminal: lastHeight == null || lastHeight === 0n,
		...(lastHeight != null && lastHeight > 0n && {
			token: String(lastHeight - 1n),
		}),
	}
}

const blockEdgeRow = (
	network: NetworkId,
	block: ArweaveBlockWire
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			$network: network,
		},
		height: BigInt(block.height),
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: block.indep_hash,
		...(block.previous_block !== '' && {
			[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'previousBlock')]: block.previous_block,
		}),
		[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'timestampMs')]: block.timestamp * 1000,
		[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'transactionCount')]: block.txs.length,
	},
})

const networkTipSnapshot = async (
	network: NetworkId,
	context: ResolverContext
) => {
	const {
		getBlockByHeight,
		getGatewayOrigin,
		getNetworkInfo,
	} = await import('$/sources/Arweave/Rest/queries.ts')
	const info = await getNetworkInfo()
	const pageSize = resolverContextRowLimit(context)
	const tipHeight = info.height
	const startHeight = arweaveRestBlocksStartHeight(tipHeight, context)
	const heights = (
		pageSize === 0 || startHeight < 0 ?
			[]
		:
			Array.from(
				{
					length: Math.min(pageSize, startHeight + 1),
				},
				(_, index) => startHeight - index
			)
	)
	const blocks = await Promise.all(
		heights.map((height) => getBlockByHeight(height))
	)
	const timestampMs = Date.now()
	return {
		$network: {
			[EntityMetaKey.Selector]: {
				$network: network,
			},
		},
		blockCount: tipHeight + 1,
		blocks: blocks.map((block) => blockEdgeRow(network, block)),
		timestamps: [{
			[EntityMetaKey.Selector]: {
				$network: {
					$network: network,
				},
				timestampMs,
				source: Source.Arweave_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'latestHeight')]: BigInt(info.height),
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'latestBlockHash')]: info.current,
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'currentBlockHash')]: info.current,
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'networkId')]: info.network,
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'peerCount')]: info.peers,
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'queuedTransactionCount')]: info.queue_length,
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'gatewayOrigin')]: getGatewayOrigin(),
				[entityFieldAddressKey(EntityType.ArweaveNetwork_Timestamp, [], 'reachable')]: true,
			},
		}],
	}
}

export default {
	source: Source.Arweave_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.ArweaveNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertArweaveNetwork($network)
						return networkTipSnapshot($network, context)
					},
				},
			},
		})({
			$network: (snapshot) => snapshot.$network,
			$$timestamps: (snapshot) => snapshot.timestamps,
			$$blocks: {
				select: (snapshot) => snapshot.blocks,
				resolveCount: (snapshot) => snapshot.blockCount,
				continuation: (snapshot) => arweaveRestBlockPageContinuation(snapshot.blocks),
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					appliesTo: [
						arweaveSlugNetwork,
					],
					resolve: async (network, context) => {
						assertArweaveNetwork(network)
						const snapshot = await networkTipSnapshot(network, context)
						return {
							blockCount: snapshot.blockCount,
							blocks: snapshot.blocks,
							timestamps: snapshot.timestamps,
						}
					},
				},
			},
		})({
			Arweave: {
				$$timestamps: (snapshot) => snapshot.timestamps,
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => snapshot.blockCount,
					continuation: (snapshot) => arweaveRestBlockPageContinuation(snapshot.blocks),
				},
			},
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
						const block = await getBlockByHeight(Number(height))
						if (BigInt(block.height) !== height)
							throw new Error('Arweave_Rest: block height does not match request')

						return mapBlockWire(
							$network.$network,
							block
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
						const block = await getBlockByHash(indepHash)
						if (block.indep_hash !== indepHash)
							throw new Error('Arweave_Rest: block hash does not match request')

						return mapBlockWire(
							$network.$network,
							block
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
			$$transactions: {
				select: (block) => block.transactions,
				resolveCount: (block) => block.transactionCount,
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveTransaction,
			resolve: {
				NetworkTransactionId: {
					resolve: async ({
						$network,
						transactionId,
					}) => {
						assertArweaveNetworkHub($network)
						const {
							decodeArweaveTagField,
							getTransaction,
							getTransactionStatus,
							ownerAddressFromOwnerKey,
						} = await import('$/sources/Arweave/Rest/queries.ts')
						const transaction = await getTransaction(transactionId)
						if (transaction.id !== transactionId)
							throw new Error('Arweave_Rest: transaction ID does not match request')

						const ownerAddress = await ownerAddressFromOwnerKey(transaction.owner)
						const dataSizeBytes = BigInt(transaction.data_size)
						const status = await getTransactionStatus(transactionId)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							transactionId,
							ownerAddress,
							...(transaction.target !== '' && {
								targetAddress: transaction.target,
							}),
							quantityWinston: BigInt(transaction.quantity),
							rewardWinston: BigInt(transaction.reward),
							signature: transaction.signature,
							...(transaction.last_tx !== '' && {
								lastTx: transaction.last_tx,
							}),
							...(transaction.data_root !== '' && {
								dataRoot: transaction.data_root,
							}),
							dataSizeBytes,
							tags: transaction.tags.map((tag) => ({
								name: decodeArweaveTagField(tag.name, 'tag name'),
								value: decodeArweaveTagField(tag.value, 'tag value'),
							})),
							format: transaction.format,
							...(status != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										height: BigInt(status.block_height),
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.ArweaveBlock, [], 'indepHash')]: status.block_indep_hash,
									},
								},
							}),
							...(dataSizeBytes > 0n && {
								$resource: {
									[EntityMetaKey.Selector]: {
										transactionId,
										contentPath: '',
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]: arweaveCanonicalUri(transactionId, ''),
									},
								},
							}),
						}
					},
				},
			},
		})({
			$network: (transaction) => transaction.$network,
			transactionId: (transaction) => transaction.transactionId,
			ownerAddress: (transaction) => transaction.ownerAddress,
			targetAddress: (transaction) => transaction.targetAddress,
			quantityWinston: (transaction) => transaction.quantityWinston,
			rewardWinston: (transaction) => transaction.rewardWinston,
			signature: (transaction) => transaction.signature,
			lastTx: (transaction) => transaction.lastTx,
			dataRoot: (transaction) => transaction.dataRoot,
			dataSizeBytes: (transaction) => transaction.dataSizeBytes,
			tags: (transaction) => transaction.tags,
			format: (transaction) => transaction.format,
			$block: (transaction) => transaction.$block,
			$resource: (transaction) => transaction.$resource,
		}),

		defineResolver({
			entityType: EntityType.ArweaveResource,
			resolve: {
				TransactionId: {
					resolve: async ({ transactionId }) => {
						if (!/^[A-Za-z0-9_-]{43}$/.test(transactionId))
							throw new Error('Arweave_Rest: invalid transaction ID')
						const { fetchBrowseResult } = await import('$/sources/Arweave/Rest/queries.ts')
						const browseResult = await fetchBrowseResult({ transactionId })
						const timestampMs = Date.now()
						return {
							transactionId,
							contentPath: '',
							canonicalUri: arweaveCanonicalUri(transactionId, ''),
							$transaction: {
								[EntityMetaKey.Selector]: {
									$network: { $network: arweaveSlugNetwork },
									transactionId,
								},
							},
							timestamps: [{
								[EntityMetaKey.Selector]: {
									$resource: { transactionId },
									timestampMs,
									source: Source.Arweave_Rest,
								},
								[EntityMetaKey.Fields]: arweaveResourceTimestampFieldRowsFromBrowseResult(browseResult),
							}],
						}
					},
				},
				TransactionIdContentPath: {
					resolve: async ({
						transactionId,
						contentPath,
					}) => {
						if (!/^[A-Za-z0-9_-]{43}$/.test(transactionId))
							throw new Error('Arweave_Rest: invalid transaction ID')
						const normalizedContentPath = assertGatewayContentPath({
							family: ContentGatewayFamily.Arweave,
							contentPath,
						})
						const { fetchBrowseResult } = await import('$/sources/Arweave/Rest/queries.ts')
						const browseResult = await fetchBrowseResult({
							transactionId,
							contentPath: normalizedContentPath,
						})
						const timestampMs = Date.now()
						return {
							transactionId,
							contentPath: normalizedContentPath,
							canonicalUri: arweaveCanonicalUri(transactionId, normalizedContentPath),
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
										contentPath: normalizedContentPath,
									},
									timestampMs,
									source: Source.Arweave_Rest,
								},
								[EntityMetaKey.Fields]: arweaveResourceTimestampFieldRowsFromBrowseResult(browseResult),
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
			entityType: EntityType.ArweaveResource,
			resolve: {
				TransactionId: {
					resolve: async ({ transactionId }) => {
						const {
							fetchRawTransactionContent,
							parseArweaveManifest,
						} = await import('$/sources/Arweave/Rest/queries.ts')
						const raw = await fetchRawTransactionContent({ transactionId })
						if (raw.contentType !== 'application/x.arweave-manifest+json')
							return { paths: [] }
						const manifest = parseArweaveManifest(raw.text)
						return {
							version: manifest.version,
							...(manifest.index?.path != null && {
								declaredIndexPath: manifest.index.path,
							}),
							...(manifest.index?.id != null ? {
								indexResource: {
									[EntityMetaKey.Selector]: { transactionId: manifest.index.id },
								},
							} : manifest.index?.path != null && Object.hasOwn(manifest.paths, manifest.index.path) ? {
								indexResource: {
									[EntityMetaKey.Selector]: { transactionId: manifest.paths[manifest.index.path].id },
								},
							} : {}),
							...(manifest.fallback != null && {
								fallbackResource: {
									[EntityMetaKey.Selector]: { transactionId: manifest.fallback.id },
								},
							}),
							paths: Object.entries(manifest.paths).map(([path, target]) => ({
								[EntityMetaKey.Selector]: {
									$manifest: { transactionId },
									path,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.ArweaveManifestPath, [], '$resource')]: {
										[EntityMetaKey.Selector]: { transactionId: target.id },
									},
								},
							})),
						}
					},
				},
			},
		})({
			manifestVersion: (resource) => resource.version,
			manifestDeclaredIndexPath: (resource) => resource.declaredIndexPath,
			$manifestIndexResource: (resource) => resource.indexResource,
			$manifestFallbackResource: (resource) => resource.fallbackResource,
			$$manifestPaths: {
				select: (resource) => resource.paths,
				resolveCount: (resource) => resource.paths.length,
			},
		}),

		defineResolver({
			entityType: EntityType.ArweaveManifestPath,
			resolve: {
				ManifestPath: {
					resolve: async ({ $manifest, path }) => {
						const {
							fetchRawTransactionContent,
							parseArweaveManifest,
						} = await import('$/sources/Arweave/Rest/queries.ts')
						const raw = await fetchRawTransactionContent({
							transactionId: $manifest.transactionId,
						})
						if (raw.contentType !== 'application/x.arweave-manifest+json')
							throw new Error('Arweave_Rest: resource is not a path manifest')

						const target = Object.entries(parseArweaveManifest(raw.text).paths)
							.find(([manifestPath]) => manifestPath === path)?.[1]
						if (target == null)
							throw new Error(`Arweave_Rest: manifest path not found ${path}`)

						return {
							$resource: {
								[EntityMetaKey.Selector]: {
									transactionId: target.id,
								},
							},
						}
					},
				},
			},
		})({
			$resource: (manifestPath) => manifestPath.$resource,
		}),
	],
} satisfies RegisteredSourceResolverModule
