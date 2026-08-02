import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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

export default {
	source: Source.SqdPortal_RawHttp,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						if (
							$network.caip2.namespace !== 'eip155'
							|| $network.caip2.reference !== networkBySlug.ethereum.caip2.reference
						)
							throw new Error(`SqdPortal_RawHttp: unsupported network ${$network.caip2.namespace}:${$network.caip2.reference}`)

						const { getEvmBlock } = await import('$/sources/Sqd/Portal/queries.ts')
						const result = await getEvmBlock(blockNumber)
						if (result.resolution !== SqdPortalResolution.Complete)
							throw new Error(`SqdPortal_RawHttp: ${result.resolution} block ${blockNumber.toString()}`)

						const hash = hexLowerOfByteSize(result.block.header.hash, 32)
						const parentHash = hexLowerOfByteSize(result.block.header.parentHash, 32)
						if (hash == null || parentHash == null)
							throw new Error('SqdPortal_RawHttp: malformed block hash')

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
			$$transactions: (block) => block.transactions,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.SqdPortal_RawHttp>
