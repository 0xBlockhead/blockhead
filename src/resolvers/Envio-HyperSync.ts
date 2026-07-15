import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EvmBlockSelector } from '$/schema/EvmBlock.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
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

export default {
	source: Source.EnvioHyperSync_RawHttp,

	resolvers: [
		defineResolver(Source.EnvioHyperSync_RawHttp, {
			entityType: EntityType.EvmBlock,
			resolve: {
				[EvmBlockSelector.EvmNetworkBlockNumber]: async ({ $network, blockNumber }) => {
					const binding = sourceProviderDefinitions
						.flatMap((provider) => provider.bindings)
						.find((candidate) => (
							candidate.source === Source.EnvioHyperSync_RawHttp
							&& candidate.target.key === $network.caip2.reference
						))
					if ($network.caip2.namespace !== 'eip155' || binding == null)
						throw new Error(`EnvioHyperSync_RawHttp: unsupported network ${$network.caip2.namespace}:${$network.caip2.reference}`)

					const { getEvmBlockRangePage } = await import('$/sources/Envio/HyperSync/queries.ts')
					const result = await getEvmBlockRangePage({
						binding,
						fromBlock: blockNumber,
						toBlock: blockNumber + 1n,
					})
					if (result.resolution !== EnvioHyperSyncResolution.Complete)
						throw new Error(`EnvioHyperSync_RawHttp: ${result.resolution} block ${blockNumber.toString()}`)

					const block = result.blocks.find((candidate) => candidate.number === Number(blockNumber))
					if (block == null)
						throw new Error(`EnvioHyperSync_RawHttp: block ${blockNumber.toString()} not returned`)

					const hash = hexLowerOfByteSize(block.hash, 32)
					const parentHash = hexLowerOfByteSize(block.parent_hash, 32)
					if (hash == null || parentHash == null)
						throw new Error('EnvioHyperSync_RawHttp: malformed block hash')

					return {
						hash,
						parentHash,
						timestamp: block.timestamp * 1_000,
						gasUsed: quantity(block.gas_used, 'gas used'),
						gasLimit: quantity(block.gas_limit, 'gas limit'),
						baseFeePerGas: quantity(block.base_fee_per_gas, 'base fee per gas'),
						blobGasUsed: quantity(block.blob_gas_used, 'blob gas used'),
						excessBlobGas: quantity(block.excess_blob_gas, 'excess blob gas'),
						transactionCount: result.transactions.filter((transaction) => (
							transaction.block_number === block.number
						)).length,
						transactions: result.transactions
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
			$$transactions: (block) => block.transactions,
		}),
	],
}
