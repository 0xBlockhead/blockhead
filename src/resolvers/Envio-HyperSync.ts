import { networkBySlug } from '$/constants/Network.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type Entity,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { EnvioHyperSyncResolution } from '$/sources/Envio/HyperSync/types.ts'

const quantity = (
	value: string | undefined,
	fieldName: string
) => {
	if (value == null)
		return undefined

	try {
		const parsed = BigInt(value)
		if (parsed < 0n)
			throw new Error()

		return parsed
	} catch {
		throw new Error(`EnvioHyperSync_RawHttp: malformed ${fieldName}`)
	}
}

const assertEthereumMainnet = (network: EntitySelector<typeof schema, EntityType.Network>) => {
	if (
		(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.ethereum.caip2.namespace
			&& network.caip2.reference === networkBySlug.ethereum.caip2.reference
		)
		|| (
			'slug' in network
			&& network.slug === networkBySlug.ethereum.slug
		)
	)
		return

	throw new Error('EnvioHyperSync_RawHttp: unsupported network')
}

const tipBlockReferences = async (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertEthereumMainnet($network)
	const { getHeight } = await import('$/sources/Envio/HyperSync/queries.ts')
	const { height } = await getHeight()
	const tip = BigInt(height)
	if (
		context.providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
	)
		throw new Error(`${Source.EnvioHyperSync_RawHttp}: invalid blocks continuation`)

	const firstBlockNumber = context.providerContinuationToken == null ?
		tip - BigInt(context.pagination.offset ?? 0)
	:
		BigInt(context.providerContinuationToken)
	if (firstBlockNumber > tip)
		throw new Error(`${Source.EnvioHyperSync_RawHttp}: blocks continuation exceeds head`)

	return {
		blocks: Array.from({
			length: Math.min(
				Math.max(
					Number(firstBlockNumber + 1n),
					0
				),
				Math.max(1, resolverContextRowLimit(context))
			),
		}, (_value, blockOffset) => ({
			[EntityMetaKey.Selector]: {
				$network,
				blockNumber: firstBlockNumber - BigInt(blockOffset),
			},
		} satisfies Entity<typeof schema, EntityType.EvmBlock>)),
	}
}

const hyperSyncTipBlockObservationClock = async () => {
	const { getHeight, getEvmBlockRangePage } = await import('$/sources/Envio/HyperSync/queries.ts')
	const { height } = await getHeight()
	const blockHeight = BigInt(height)
	const result = await getEvmBlockRangePage({
		fromBlock: blockHeight,
		toBlock: blockHeight + 1n,
	})
	if (result.resolution !== EnvioHyperSyncResolution.Complete)
		throw new Error(`EnvioHyperSync_RawHttp: ${result.resolution} tip block ${blockHeight.toString()}`)

	const block = result.data.blocks.find((candidate) => candidate.number === height)
	if (block == null)
		throw new Error('EnvioHyperSync_RawHttp: tip block missing for network observation clock')

	return {
		blockHeight,
		timestampMs: block.timestamp * 1_000,
	}
}

const networkTipResolvers = {
	Caip2: {
		resolve: async (
			network: EntitySelector<typeof schema, EntityType.Network>,
			context: Parameters<typeof resolverContextRowLimit>[0]
		) => tipBlockReferences(network, context),
	},
	Slug: {
		resolve: async (
			network: EntitySelector<typeof schema, EntityType.Network>,
			context: Parameters<typeof resolverContextRowLimit>[0]
		) => tipBlockReferences(network, context),
	},
} as const

const networkTipCountResolvers = {
	Caip2: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const { getHeight } = await import('$/sources/Envio/HyperSync/queries.ts')
			return (await getHeight()).height + 1
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const { getHeight } = await import('$/sources/Envio/HyperSync/queries.ts')
			return (await getHeight()).height + 1
		},
	},
} as const

const networkTimestampListResolvers = {
	Caip2: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const tipClock = await hyperSyncTipBlockObservationClock()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: tipClock.timestampMs,
					source: Source.EnvioHyperSync_RawHttp,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: tipClock.blockHeight,
				},
			}]
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const tipClock = await hyperSyncTipBlockObservationClock()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: tipClock.timestampMs,
					source: Source.EnvioHyperSync_RawHttp,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: tipClock.blockHeight,
				},
			}]
		},
	},
} as const

export default {
	source: Source.EnvioHyperSync_RawHttp,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						assertEthereumMainnet($network)
						const { getEvmBlockRangePage } = await import('$/sources/Envio/HyperSync/queries.ts')
						const result = await getEvmBlockRangePage({
							fromBlock: blockNumber,
							toBlock: blockNumber + 1n,
						})
						if (result.resolution !== EnvioHyperSyncResolution.Complete)
							throw new Error(`EnvioHyperSync_RawHttp: ${result.resolution} block ${blockNumber.toString()}`)

						const block = result.data.blocks.find((candidate) => candidate.number === Number(blockNumber))
						if (block == null)
							throw new Error(`EnvioHyperSync_RawHttp: block ${blockNumber.toString()} not returned`)

						const hash = hexLowerOfByteSize(block.hash, 32)
						const parentHash = hexLowerOfByteSize(block.parent_hash, 32)
						if (hash == null || parentHash == null)
							throw new Error('EnvioHyperSync_RawHttp: malformed block hash')

						const miner = hexLowerOfByteSize(block.miner, 20)
						if (miner == null)
							throw new Error('EnvioHyperSync_RawHttp: malformed miner address')

						return {
							hash,
							parentHash,
							timestamp: block.timestamp * 1_000,
							gasUsed: quantity(block.gas_used, 'gas used'),
							gasLimit: quantity(block.gas_limit, 'gas limit'),
							baseFeePerGas: quantity(block.base_fee_per_gas, 'base fee per gas'),
							blobGasUsed: quantity(block.blob_gas_used, 'blob gas used'),
							excessBlobGas: quantity(block.excess_blob_gas, 'excess blob gas'),
							transactionCount: result.data.transactions.filter((transaction) => (
								transaction.block_number === block.number
							)).length,
							$miner: {
								[EntityMetaKey.Selector]: {
									address: miner,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							...(blockNumber > 0n && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										blockNumber: blockNumber - 1n,
									},
								} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							}),
							transactions: result.data.transactions
								.filter((transaction) => transaction.block_number === block.number)
								.map((transaction) => {
									const txHash = hexLowerOfByteSize(transaction.hash, 32)
									if (txHash == null)
										throw new Error('EnvioHyperSync_RawHttp: malformed transaction hash')

									return {
										[EntityMetaKey.Selector]: {
											$network,
											txHash,
										},
									}
								}),
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			parentHash: (block) => block.parentHash,
			timestamp: (block) => block.timestamp,
			gasUsed: (block) => block.gasUsed,
			gasLimit: (block) => block.gasLimit,
			baseFeePerGas: (block) => block.baseFeePerGas,
			blobGasUsed: (block) => block.blobGasUsed,
			excessBlobGas: (block) => block.excessBlobGas,
			transactionCount: (block) => block.transactionCount,
			$miner: (block) => block.$miner,
			$parent: (block) => block.$parent,
			$$transactions: (block) => block.transactions,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: networkTipResolvers,
		})({
			Evm: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					continuation: (snapshot) => {
						const lastBlockNumber = snapshot.blocks.at(-1)?.[EntityMetaKey.Selector].blockNumber
						return {
							operation: 'network-blocks',
							terminal: lastBlockNumber == null || lastBlockNumber === 0n,
							...(lastBlockNumber != null && lastBlockNumber > 0n && {
								token: String(lastBlockNumber - 1n),
							}),
						}
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: networkTipCountResolvers,
		})({
			Evm: {
				$$blocks: {
					resolveCount: (count) => count,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: networkTimestampListResolvers,
		})({
			Evm: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

	],
} satisfies RegisteredSourceResolverModule
