import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


type KaspaNetworkId = EntitySelector<typeof schema, EntityType.KaspaNetwork>

const kaspaNetworkApplicability = [{
	$network: {
		slug: networkBySlug.kaspa.slug,
	},
}] as const

const kaspaAddressApplicability = [{
	$network: {
		$network: {
			slug: networkBySlug.kaspa.slug,
		},
	},
}] as const

const assertKaspaMainnet = (
	network: KaspaNetworkId
) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug.kaspa.slug
	)
		return

	throw new Error('Kaspa Explorer: unsupported network')
}

const assertCurrentObservation = (
	timestampMs: number,
	context: ResolverContext,
	label: string
) => {
	const requestedTimestamps = context.filters.flatMap((filter) => {
		if (filter.fieldPath.length !== 1 || filter.fieldPath[0] !== 'timestampMs')
			return []
		return Array.isArray(filter.value) ? filter.value : [filter.value]
	})
	if (requestedTimestamps.some((requestedTimestamp) => requestedTimestamp !== timestampMs))
		throw new Error(`Kaspa Explorer: historical ${label} observations are unsupported`)
}

const kaspaTransactionFields = (
	transaction: {
		transaction_id: string
		version?: number
		subnetwork_id?: string
		mass?: string
		payload?: string
		block_hash?: string[]
	}
) => ({
	...(transaction.version != null && {
		[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'version')]: transaction.version,
	}),
	...(transaction.subnetwork_id != null && {
		[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'subnetworkId')]: transaction.subnetwork_id,
	}),
	...(transaction.mass != null && {
		[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'mass')]: BigInt(transaction.mass),
	}),
	...(transaction.payload != null && {
		[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'payloadLength')]: transaction.payload.length / 2,
	}),
	...(
		transaction.block_hash != null
		&& transaction.block_hash.length > 0
		&& {
			[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'blockHashes')]: transaction.block_hash,
		}
	),
})

const kaspaAcceptedTransaction = (
	network: KaspaNetworkId,
	acceptingBlockHash: string,
	transactionId: string,
	acceptedIndex?: number
) => ({
	[EntityMetaKey.Selector]: {
		$acceptingBlock: {
			$network: network,
			blockHash: acceptingBlockHash,
		},
		$transaction: {
			$network: network,
			transactionId,
		},
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.KaspaAcceptedTransaction, [], 'acceptingBlockHash')]: acceptingBlockHash,
		[entityFieldAddressKey(EntityType.KaspaAcceptedTransaction, [], 'transactionId')]: transactionId,
		...(acceptedIndex != null && {
			[entityFieldAddressKey(EntityType.KaspaAcceptedTransaction, [], 'acceptedIndex')]: acceptedIndex,
		}),
	},
})

export default {
	source: Source.KaspaExplorer,

	resolvers: [
		defineResolver({
			entityType: EntityType.KaspaNetwork,
			resolve: {
				Network: {
					appliesTo: kaspaNetworkApplicability,
					resolve: async ({ $network }) => {
						assertKaspaMainnet({ $network })
						const {
							getBlockdag,
							getKaspadInfo,
							getVirtualChainBlueScore,
						} = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const [
							blockdag,
							blueScore,
							kaspad,
						] = await Promise.all([
							getBlockdag(),
							getVirtualChainBlueScore(),
							getKaspadInfo(),
						])
						const timestampMs = Number(blockdag.pastMedianTime)
						return [{
							[EntityMetaKey.Selector]: {
								$network: { $network },
								timestampMs,
								source: Source.KaspaExplorer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualDaaScore')]: BigInt(blockdag.virtualDaaScore),
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualBlueScore')]: BigInt(blueScore.blueScore),
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualSelectedParentHash')]: blockdag.sink,
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'pruningPointHash')]: blockdag.pruningPointHash,
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'sinkCount')]: blockdag.tipHashes.length,
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'blockCount')]: Number(blockdag.blockCount),
								[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'difficulty')]: blockdag.difficulty,
									[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'hasUtxoIndex')]: kaspad.isUtxoIndexed,
									[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'serverVersion')]: kaspad.serverVersion,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.KaspaAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: kaspaAddressApplicability,
					resolve: async (address, context) => {
						assertKaspaMainnet(address.$network)
						if (resolverContextRowLimit(context) === 0)
							return []

						const {
							getAddressBalance,
							getAddressTransactionCount,
							getAddressUtxoCount,
							getBlockdag,
						} = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const [
							balance,
							transactions,
							utxos,
							blockdag,
						] = await Promise.all([
							getAddressBalance({ kaspaAddress: address.address }),
							getAddressTransactionCount({ kaspaAddress: address.address }),
							getAddressUtxoCount({ kaspaAddress: address.address }),
							getBlockdag(),
						])
						const timestampMs = Number(blockdag.pastMedianTime)
						assertCurrentObservation(timestampMs, context, 'address')
						return [{
							[EntityMetaKey.Selector]: {
								$address: address,
								timestampMs,
								source: Source.KaspaExplorer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'balanceSompi')]: BigInt(balance.balance),
								[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'utxoCount')]: utxos.count,
								[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'transactionCount')]: transactions.total,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.KaspaAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: kaspaAddressApplicability,
					resolve: async (address, context) => {
						assertKaspaMainnet(address.$network)
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const { getBlockdag, getCompleteAddressUtxos } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const [utxos, blockdag] = await Promise.all([
							getCompleteAddressUtxos({ kaspaAddress: address.address }),
							getBlockdag(),
						])
						if (utxos.length > limit)
							throw new Error('Kaspa Explorer: complete UTXO snapshot exceeds the requested row limit')
						const timestampMs = Number(blockdag.pastMedianTime)
						assertCurrentObservation(timestampMs, context, 'address UTXO')
						return utxos.map((utxo) => ({
							[EntityMetaKey.Selector]: {
								$address: address,
								outpointTransactionId: utxo.outpoint.transactionId,
								outpointIndex: utxo.outpoint.index,
								timestampMs,
								source: Source.KaspaExplorer,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'amountSompi')]: BigInt(utxo.utxoEntry.amount),
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'scriptPublicKey')]: utxo.utxoEntry.scriptPublicKey.scriptPublicKey,
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'blockDaaScore')]: BigInt(utxo.utxoEntry.blockDaaScore),
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'isCoinbase')]: utxo.utxoEntry.isCoinbase,
							},
						}))
					},
				},
			},
		})({
			$$utxos: (utxos) => utxos,
		}),

		defineResolver({
			entityType: EntityType.KaspaAddress,
			resolve: {
				NetworkAddress: {
					appliesTo: kaspaAddressApplicability,
					resolve: async (address, context) => {
						assertKaspaMainnet(address.$network)
						const limit = Math.min(resolverContextRowLimit(context), 500)
						if (limit === 0)
							return {
								before: undefined,
								limit,
								nextBefore: undefined,
								transactions: [],
							}

						const before = context.providerContinuationToken == null ?
							undefined
						:
							Number(context.providerContinuationToken)
						if (
							context.providerContinuationToken != null
							&& (
								!Number.isSafeInteger(before)
								|| before < 0
								|| before.toString() !== context.providerContinuationToken
							)
						)
							throw new Error('Kaspa Explorer: invalid address transaction continuation')

						const { getAddressTransactionsPage } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						return {
							before,
							limit,
							...await getAddressTransactionsPage({
								kaspaAddress: address.address,
								limit,
								before,
							}),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page, address) => page.transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: address.$network,
						transactionId: transaction.transaction_id,
					},
					[EntityMetaKey.Fields]: kaspaTransactionFields(transaction),
				})),
				continuation: (page, address) => {
					if (page.limit === 0 || page.nextBefore == null)
						return {
							operation: 'address-transactions',
							target: address.address,
							terminal: true,
						}

					if (page.nextBefore === page.before)
						throw new Error('Kaspa Explorer: transaction continuation did not advance')
					return {
						operation: 'address-transactions',
						target: address.address,
						terminal: false,
						token: page.nextBefore.toString(),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.KaspaTransaction,
			resolve: {
				NetworkTransactionId: {
					appliesTo: kaspaAddressApplicability,
					resolve: async ({ $network, transactionId }) => {
						assertKaspaMainnet($network)
						const { getTransaction } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const transaction = await getTransaction({
							transaction_id: transactionId,
						})
						const acceptances = (
							transaction.is_accepted === true
							&& transaction.accepting_block_hash != null
								? [kaspaAcceptedTransaction($network, transaction.accepting_block_hash, transactionId)]
								: []
						)
						return {
							...(transaction.version != null && {
								version: transaction.version,
							}),
							...(transaction.subnetwork_id != null && {
								subnetworkId: transaction.subnetwork_id,
							}),
							...(transaction.mass != null && {
								mass: BigInt(transaction.mass),
							}),
							...(transaction.payload != null && {
								payloadLength: transaction.payload.length / 2,
							}),
							...(
								transaction.block_hash != null
								&& transaction.block_hash.length > 0
								&& {
									blockHashes: transaction.block_hash,
								}
							),
							acceptances,
						}
					},
				},
			},
		})({
			version: (transaction) => transaction.version,
			subnetworkId: (transaction) => transaction.subnetworkId,
			mass: (transaction) => transaction.mass,
			payloadLength: (transaction) => transaction.payloadLength,
			blockHashes: (transaction) => transaction.blockHashes,
			$$acceptances: (transaction) => transaction.acceptances,
		}),

		defineResolver({
			entityType: EntityType.KaspaAcceptedTransaction,
			resolve: {
				AcceptingBlockTransaction: {
					resolve: async ({ $acceptingBlock, $transaction }) => {
						assertKaspaMainnet($acceptingBlock.$network)
						assertKaspaMainnet($transaction.$network)
						const { getTransaction } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const transaction = await getTransaction({
							transaction_id: $transaction.transactionId,
							blockHash: $acceptingBlock.blockHash,
						})
						if (
							transaction.is_accepted !== true
							|| transaction.accepting_block_hash !== $acceptingBlock.blockHash
						)
							throw new Error('Kaspa Explorer: transaction acceptance does not match its selector')
						return {
							acceptingBlockHash: transaction.accepting_block_hash,
							transactionId: transaction.transaction_id,
						}
					},
				},
			},
		})({
			acceptingBlockHash: (acceptance) => acceptance.acceptingBlockHash,
			transactionId: (acceptance) => acceptance.transactionId,
		}),

		defineResolver({
			entityType: EntityType.KaspaBlock,
			resolve: {
				NetworkBlockHash: {
					appliesTo: kaspaAddressApplicability,
					resolve: async ({ $network, blockHash }) => {
						assertKaspaMainnet($network)
						const { getBlock } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const block = await getBlock({
							blockId: blockHash,
							includeTransactions: false,
						})
						const parentHashes = block.header.parents
							.flatMap((parent) => parent.parentHashes)
						return {
							version: block.header.version,
							timestampMs: Number(block.header.timestamp),
							blueScore: BigInt(block.header.blueScore),
							daaScore: BigInt(block.header.daaScore),
							bits: block.header.bits,
							nonce: BigInt(block.header.nonce),
							hashMerkleRoot: block.header.hashMerkleRoot,
							acceptedIdMerkleRoot: block.header.acceptedIdMerkleRoot,
							utxoCommitment: block.header.utxoCommitment,
							selectedParentHash: block.verboseData.selectedParentHash,
							...(parentHashes.length > 0 && {
								parentHashes,
							}),
							...(
								block.verboseData.mergeSetBluesHashes.length > 0
								&& {
									mergeSetBlues: block.verboseData.mergeSetBluesHashes,
								}
							),
							...(
								block.verboseData.mergeSetRedsHashes.length > 0
								&& {
									mergeSetReds: block.verboseData.mergeSetRedsHashes,
								}
							),
						}
					},
				},
			},
		})({
			version: (block) => block.version,
			timestampMs: (block) => block.timestampMs,
			blueScore: (block) => block.blueScore,
			daaScore: (block) => block.daaScore,
			bits: (block) => block.bits,
			nonce: (block) => block.nonce,
			hashMerkleRoot: (block) => block.hashMerkleRoot,
			acceptedIdMerkleRoot: (block) => block.acceptedIdMerkleRoot,
			utxoCommitment: (block) => block.utxoCommitment,
			selectedParentHash: (block) => block.selectedParentHash,
			parentHashes: (block) => block.parentHashes,
			mergeSetBlues: (block) => block.mergeSetBlues,
			mergeSetReds: (block) => block.mergeSetReds,
		}),

		defineResolver({
			entityType: EntityType.KaspaNetwork,
			resolve: {
				Network: {
					appliesTo: kaspaNetworkApplicability,
					resolve: async (network, context) => {
						assertKaspaMainnet(network)
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const { getBlockdag } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const blockdag = await getBlockdag()
						return blockdag.tipHashes
							.slice(0, limit)
							.map((blockHash) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									blockHash,
								},
							}))
					},
				},
			},
		})({
			$$blocks: (blocks) => blocks,
		}),
	],
} satisfies RegisteredSourceResolverModule
