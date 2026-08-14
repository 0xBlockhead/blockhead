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
import { SqdPortalResolution } from '$/sources/Sqd/Portal/types.ts'

const quantity = (
	value: string | null | undefined,
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
		throw new Error(`SqdPortal_RawHttp: malformed ${fieldName}`)
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

	throw new Error('SqdPortal_RawHttp: unsupported network')
}

const tipBlockReferences = async (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	context: Parameters<typeof resolverContextRowLimit>[0]
) => {
	assertEthereumMainnet($network)
	const { getFinalizedHead } = await import('$/sources/Sqd/Portal/queries.ts')
	const { number } = await getFinalizedHead()
	const tip = BigInt(number)
	if (
		context.providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(context.providerContinuationToken)
	)
		throw new Error(`${Source.SqdPortal_RawHttp}: invalid blocks continuation`)

	const firstBlockNumber = context.providerContinuationToken == null ?
		tip - BigInt(context.pagination.offset ?? 0)
	:
		BigInt(context.providerContinuationToken)
	if (firstBlockNumber > tip)
		throw new Error(`${Source.SqdPortal_RawHttp}: blocks continuation exceeds finalized head`)

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
			const { getFinalizedHead } = await import('$/sources/Sqd/Portal/queries.ts')
			return (await getFinalizedHead()).number + 1
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const { getFinalizedHead } = await import('$/sources/Sqd/Portal/queries.ts')
			return (await getFinalizedHead()).number + 1
		},
	},
} as const

const networkTimestampListResolvers = {
	Caip2: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const { getFinalizedHead } = await import('$/sources/Sqd/Portal/queries.ts')
			const { number } = await getFinalizedHead()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: Date.now(),
					source: Source.SqdPortal_RawHttp,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: BigInt(number),
				},
			}]
		},
	},
	Slug: {
		resolve: async (network: EntitySelector<typeof schema, EntityType.Network>) => {
			assertEthereumMainnet(network)
			const { getFinalizedHead } = await import('$/sources/Sqd/Portal/queries.ts')
			const { number } = await getFinalizedHead()
			return [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: Date.now(),
					source: Source.SqdPortal_RawHttp,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: BigInt(number),
				},
			}]
		},
	},
} as const

export default {
	source: Source.SqdPortal_RawHttp,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						assertEthereumMainnet($network)

						const { getEvmBlock } = await import('$/sources/Sqd/Portal/queries.ts')
						const result = await getEvmBlock(blockNumber)
						if (result.resolution !== SqdPortalResolution.Complete)
							throw new Error(`SqdPortal_RawHttp: ${result.resolution} block ${blockNumber.toString()}`)

						const hash = hexLowerOfByteSize(result.block.header.hash, 32)
						const parentHash = hexLowerOfByteSize(result.block.header.parentHash, 32)
						if (hash == null || parentHash == null)
							throw new Error('SqdPortal_RawHttp: malformed block hash')

						const miner = hexLowerOfByteSize(result.block.header.miner, 20)
						if (miner == null)
							throw new Error('SqdPortal_RawHttp: malformed miner address')

						return {
							hash,
							parentHash,
							timestamp: result.block.header.timestamp * 1_000,
							gasUsed: quantity(result.block.header.gasUsed, 'gas used'),
							gasLimit: quantity(result.block.header.gasLimit, 'gas limit'),
							baseFeePerGas: quantity(result.block.header.baseFeePerGas, 'base fee per gas'),
							blobGasUsed: quantity(result.block.header.blobGasUsed, 'blob gas used'),
							excessBlobGas: quantity(result.block.header.excessBlobGas, 'excess blob gas'),
							transactionCount: result.block.transactions.length,
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
							transactions: result.block.transactions.map((transaction) => {
								const txHash = hexLowerOfByteSize(transaction.hash, 32)
								if (txHash == null)
									throw new Error('SqdPortal_RawHttp: malformed transaction hash')

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
