import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	networkBySlug,
	NetworkExecutionModel,
	NetworkLedgerModel,
} from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	CometBftBlockchainResponse,
	CometBftBlockResponse,
	CometBftTxResponse,
} from '$/sources/CometBft/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCosmosHub = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.cosmos.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cosmos.caip2.namespace
			&& network.caip2.reference === networkBySlug.cosmos.caip2.reference
		)
	)
		return

	throw new Error('CometBft_Rest: unsupported network')
}

const cosmosNetworkApplicability = [
	{
		caip2: networkBySlug.cosmos.caip2,
	},
	{
		slug: 'cosmos',
	},
] as const

const cosmosNetworkResolverSelectors = <_Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: [cosmosNetworkApplicability[0]],
		resolve,
	},
	Slug: {
		appliesTo: [cosmosNetworkApplicability[1]],
		resolve,
	},
})

const cosmosBlockFields = (wireBlock: CometBftBlockResponse) => ({
	hash: wireBlock.result.block_id.hash,
	height: BigInt(wireBlock.result.block.header.height),
	proposerConsensusAddress: wireBlock.result.block.header.proposer_address,
	timestampMs: Date.parse(wireBlock.result.block.header.time),
	transactionCount: wireBlock.result.block.data.txs?.length ?? 0,
})

const cosmosTransactionFields = (
	$network: NetworkId,
	wireTransaction: CometBftTxResponse
) => {
	const {
		code,
		codespace,
		gas_wanted: gasWanted,
		gas_used: gasUsed,
		log,
		events,
	} = wireTransaction.result.tx_result
	return {
		$block: {
			[EntityMetaKey.Selector]: {
				$network,
				height: BigInt(wireTransaction.result.height),
			},
		},
		code,
		...(codespace != null && codespace !== '' && {
			codespace,
		}),
		gasWanted: BigInt(gasWanted),
		gasUsed: BigInt(gasUsed),
		...(log != null && log !== '' && {
			rawLog: log,
		}),
		...(events != null && events.length > 0 && {
			eventTypes: [...new Set(events.map((event) => event.type))],
		}),
	}
}

const cosmosBlockListFields = (
	meta: CometBftBlockchainResponse['result']['block_metas'][number]
) => ({
	hash: meta.block_id.hash,
	proposerConsensusAddress: meta.header.proposer_address,
	timestampMs: Date.parse(meta.header.time),
	transactionCount: Number(meta.num_txs),
})

const getCometBlockReferences = async (
	network: NetworkId,
	limit: number,
	context: ResolverContext
) => {
	assertCosmosHub(network)
	const {
		getBlockchain,
		getStatus,
	} = await import('$/sources/CometBft/Rest/queries.ts')
	const status = await getStatus()
	const latestBlockHeight = BigInt(status.result.sync_info.latest_block_height)
	const earliestBlockHeight = BigInt(status.result.sync_info.earliest_block_height ?? '1')
	const offset = context.pagination.offset ?? 0
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('CometBft_Rest: invalid block pagination offset')
	if (
		context.providerContinuationToken != null
		&& !/^[1-9]\d*$/.test(context.providerContinuationToken)
	)
		throw new Error('CometBft_Rest: invalid block continuation')

	const maxHeight = context.providerContinuationToken == null ?
		latestBlockHeight - BigInt(offset)
	:
		BigInt(context.providerContinuationToken)
	if (maxHeight > latestBlockHeight)
		throw new Error('CometBft_Rest: block continuation exceeds current tip')
	if (maxHeight < earliestBlockHeight || limit === 0)
		return {
			blocks: [],
			earliestBlockHeight,
		}

	const rowCount = Math.min(
		Number(maxHeight - earliestBlockHeight + 1n),
		limit
	)
	const minHeight = maxHeight - BigInt(rowCount - 1)
	const blockMetas: CometBftBlockchainResponse['result']['block_metas'] = []
	for (
		let windowMaxHeight = maxHeight;
		windowMaxHeight >= minHeight;
		windowMaxHeight -= 100n
	) {
		const windowMinHeight = (
			windowMaxHeight - 99n < minHeight ?
				minHeight
			:
				windowMaxHeight - 99n
		)
		const blockchain = await getBlockchain({
			minHeight: windowMinHeight,
			maxHeight: windowMaxHeight,
		})
		blockMetas.push(...blockchain.result.block_metas)
		if (windowMinHeight === minHeight)
			break
	}
	const blockHeights = new Set(blockMetas.map((meta) => meta.header.height))
	if (
		blockMetas.length !== rowCount
		|| blockHeights.size !== rowCount
		|| blockMetas.some((meta) => (
			BigInt(meta.header.height) < minHeight
			|| BigInt(meta.header.height) > maxHeight
		))
	)
		throw new Error('CometBft_Rest: incomplete blockchain height window')

	return {
		blocks: [...blockMetas]
			.sort((left, right) => (
				Number(BigInt(right.header.height) - BigInt(left.header.height))
			))
			.slice(0, rowCount)
			.map((meta) => {
				const fields = cosmosBlockListFields(meta)
				return {
					[EntityMetaKey.Selector]: {
						$network: network,
						height: BigInt(meta.header.height),
					},
					[EntityMetaKey.Fields]: Object.fromEntries(
						Object.entries(fields)
							.map(([fieldName, fieldValue]) => [
								entityFieldAddressKey(EntityType.CosmosBlock, [], fieldName),
								fieldValue,
							])
					),
				}
			}),
		earliestBlockHeight,
	}
}

export default {
	source: Source.CometBft_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.CosmosBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						assertCosmosHub($network)

						const { getBlock } = await import('$/sources/CometBft/Rest/queries.ts')
						const wireBlock = await getBlock({
							height,
						})
						const block = cosmosBlockFields(wireBlock)
						if (block.height !== height)
							throw new Error(`CometBft_Rest: block height mismatch ${block.height} !== ${height}`)

						return block
					},
				},
				NetworkHash: {
					resolve: async ({ $network, hash }) => {
						assertCosmosHub($network)

						const { getBlockByHash } = await import('$/sources/CometBft/Rest/queries.ts')
						const wireBlock = await getBlockByHash({
							hash,
						})
						const block = cosmosBlockFields(wireBlock)
						if (block.hash.toUpperCase() !== hash.replace(/^0x/i, '').toUpperCase())
							throw new Error(`CometBft_Rest: block hash mismatch ${block.hash} !== ${hash}`)

						return block
					},
				},
			},
		})({
			hash: (snapshot) => snapshot.hash,
			height: (snapshot) => snapshot.height,
			proposerConsensusAddress: (snapshot) => snapshot.proposerConsensusAddress,
			timestampMs: (snapshot) => snapshot.timestampMs,
			transactionCount: (snapshot) => snapshot.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.CosmosTransaction,
			resolve: {
				NetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						assertCosmosHub($network)
						const { getTx } = await import('$/sources/CometBft/Rest/queries.ts')
						const wireTransaction = await getTx({
							txHash,
						})
						const expectedHash = txHash.replace(/^0x/i, '').toUpperCase()
						if (wireTransaction.result.hash.toUpperCase() !== expectedHash)
							throw new Error(`CometBft_Rest: transaction hash mismatch ${wireTransaction.result.hash} !== ${txHash}`)

						return cosmosTransactionFields($network, wireTransaction)
					},
				},
			},
		})({
			$block: (snapshot) => snapshot.$block,
			code: (snapshot) => snapshot.code,
			codespace: (snapshot) => snapshot.codespace,
			gasWanted: (snapshot) => snapshot.gasWanted,
			gasUsed: (snapshot) => snapshot.gasUsed,
			rawLog: (snapshot) => snapshot.rawLog,
			eventTypes: (snapshot) => snapshot.eventTypes,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(async (network) => {
				assertCosmosHub(network)
				const {
					getBlock,
					getStatus,
				} = await import('$/sources/CometBft/Rest/queries.ts')
				const status = await getStatus()
				const {
					sync_info: syncInfo,
					node_info: nodeInfo,
					validator_info: validatorInfo,
				} = status.result
				const latestHeight = BigInt(syncInfo.latest_block_height)
				if (syncInfo.earliest_block_height != null && BigInt(syncInfo.earliest_block_height) > latestHeight)
					throw new Error('CometBft_Rest: earliest block height exceeds tip')
				if (validatorInfo?.voting_power != null && validatorInfo.voting_power === '')
					throw new Error('CometBft_Rest: malformed validator voting power')
				if (nodeInfo.id != null && nodeInfo.id === '')
					throw new Error('CometBft_Rest: malformed node id')
				const tipBlock = await getBlock({
					height: latestHeight,
				})
				const tip = cosmosBlockFields(tipBlock)
				if (tipBlock.result.block.header.app_hash != null && tipBlock.result.block.header.app_hash === '')
					throw new Error('CometBft_Rest: malformed app hash leftover')

				return [{
					[EntityMetaKey.Selector]: {
						$network: network,
						timestampMs: Date.now(),
						source: Source.CometBft_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'ledgerModels')]: [NetworkLedgerModel.Account],
						[entityFieldAddressKey(EntityType.Network_Timestamp, [], 'executionModels')]: [NetworkExecutionModel.CosmosSdk],
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockHeight')]: tip.height,
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockHash')]: tip.hash,
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockTimeMs')]: tip.timestampMs,
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'latestBlockTransactionCount')]: tip.transactionCount,
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'chainId')]: nodeInfo.network,
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'nodeNetwork')]: nodeInfo.network,
						[entityFieldAddressKey(EntityType.Network_Timestamp, ['Cosmos'], 'isSyncing')]: syncInfo.catching_up,
					},
				}]
			}),
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkResolverSelectors(async (network, context) => (
				{
					limit: resolverContextRowLimit(context),
					previousMaxHeight: context.providerContinuationToken,
					...await getCometBlockReferences(
						network,
						resolverContextRowLimit(context),
						context
					),
				}
			)),
		})({
			Cosmos: {
				$$blocks: {
					select: (page) => page.blocks,
					continuation: (page) => {
						const lastHeight = page.blocks.at(-1)?.[EntityMetaKey.Selector].height
						if (page.blocks.length < page.limit || lastHeight == null || lastHeight <= page.earliestBlockHeight)
							return {
								operation: 'network-blocks',
								target: 'cosmoshub-4',
								terminal: true,
							}

						const nextMaxHeight = lastHeight - 1n
						if (nextMaxHeight.toString() === page.previousMaxHeight)
							throw new Error('CometBft_Rest: block continuation did not advance')

						return {
							operation: 'network-blocks',
							target: 'cosmoshub-4',
							terminal: false,
							token: nextMaxHeight.toString(),
						}
					},
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
