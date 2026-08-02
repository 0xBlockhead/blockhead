import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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

export default {
	source: Source.KaspaExplorer,

	resolvers: [
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
						} = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const [
							balance,
							transactions,
							utxos,
						] = await Promise.all([
							getAddressBalance({ kaspaAddress: address.address }),
							getAddressTransactionCount({ kaspaAddress: address.address }),
							getAddressUtxoCount({ kaspaAddress: address.address }),
						])
						return [{
							[EntityMetaKey.Selector]: {
								$address: address,
								timestampMs: Date.now(),
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

						const { getCompleteAddressUtxos } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const utxos = await getCompleteAddressUtxos({
							kaspaAddress: address.address,
						})
						if (utxos.length > limit)
							throw new Error('Kaspa Explorer: complete UTXO snapshot exceeds the requested row limit')
						const timestampMs = Date.now()
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
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'mass')]: (
							transaction.mass == null ?
								undefined
							:
								BigInt(transaction.mass)
						),
					},
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
	],
} satisfies RegisteredSourceResolverModule<Source.KaspaExplorer>
