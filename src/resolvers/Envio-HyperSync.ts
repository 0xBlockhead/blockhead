import { networkBySlug } from '$/constants/Network.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
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
	],
} satisfies RegisteredSourceResolverModule
