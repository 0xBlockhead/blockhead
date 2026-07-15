import { defineResolver } from '$/resolvers/defineResolver.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { HederaBlockSelector } from '$/schema/HederaBlock.ts'
import { schema } from '$/schema/index.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import type { HederaMirrorNodeBlock } from '$/sources/HederaMirrorNode/Rest/types.ts'

const hederaMirrorNodeBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.HederaMirrorNode_Rest)

if (hederaMirrorNodeBinding == null)
	throw new Error('HederaMirrorNode_Rest: source binding is missing')

const assertHederaMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (network.slug !== 'hedera')
		throw new Error('HederaMirrorNode_Rest: unsupported network')
}

const nonnegativeSafeInteger = (
	value: number,
	fieldName: string
): number => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`HederaMirrorNode_Rest: malformed ${fieldName}`)

	return value
}

const blockFields = (
	block: HederaMirrorNodeBlock
) => ({
	blockNumber: BigInt(nonnegativeSafeInteger(block.number, 'block number')),
	blockHash: block.hash,
	consensusStartTimestamp: block.timestamp.from,
	consensusEndTimestamp: block.timestamp.to,
	...(block.gas_used != null && {
		gasUsed: BigInt(nonnegativeSafeInteger(block.gas_used, 'gas used')),
	}),
	recordFileName: block.name,
	transactionCount: nonnegativeSafeInteger(block.count, 'transaction count'),
})

export default {
	source: Source.HederaMirrorNode_Rest,

	resolvers: [
		defineResolver(Source.HederaMirrorNode_Rest, {
			entityType: EntityType.HederaBlock,
			resolve: {
				[HederaBlockSelector.NetworkBlockNumber]: async ({ $network, blockNumber: requestedBlockNumber }) => {
					assertHederaMainnet($network)
					const { getBlock } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
					const block = await getBlock(hederaMirrorNodeBinding, requestedBlockNumber.toString())
					if (BigInt(nonnegativeSafeInteger(block.number, 'block number')) !== requestedBlockNumber)
						throw new Error('HederaMirrorNode_Rest: response block does not match request')

					return blockFields(block)
				},
				[HederaBlockSelector.NetworkBlockHash]: async ({ $network, blockHash: requestedBlockHash }) => {
					assertHederaMainnet($network)
					const { getBlock } = await import('$/sources/HederaMirrorNode/Rest/queries.ts')
					const block = await getBlock(hederaMirrorNodeBinding, requestedBlockHash)
					if (
						block.hash.replace(/^0x/i, '').toLowerCase()
						!== requestedBlockHash.replace(/^0x/i, '').toLowerCase()
					)
						throw new Error('HederaMirrorNode_Rest: response block does not match request')

					return blockFields(block)
				},
			},
		})({
			blockNumber: (block) => block.blockNumber,
			blockHash: (block) => block.blockHash,
			consensusStartTimestamp: (block) => block.consensusStartTimestamp,
			consensusEndTimestamp: (block) => block.consensusEndTimestamp,
			gasUsed: (block) => block.gasUsed,
			recordFileName: (block) => block.recordFileName,
			transactionCount: (block) => block.transactionCount,
		}),
	],
}
