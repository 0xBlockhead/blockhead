import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	CometBftBlockResponse,
	CometBftTxResponse,
} from '$/sources/CometBft/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCosmosHub = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== networkBySlug.cosmos.caip2.namespace
		|| network.caip2.reference !== networkBySlug.cosmos.caip2.reference
	)
		throw new Error('CometBft_Rest: unsupported network')
}

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
	],
} satisfies RegisteredSourceResolverModule
