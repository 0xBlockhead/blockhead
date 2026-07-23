import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { KaspaAddressSelector } from '$/schema/KaspaAddress.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

type KaspaNetworkId = EntitySelector<typeof schema, EntityType.KaspaNetwork>

const kaspaExplorerBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.KaspaExplorer_Rest
		&& binding.target.kind === SourceTargetKind.Global
		&& binding.target.key === 'kaspa-explorer-api'
	))

if (kaspaExplorerBindings.length !== 1)
	throw new Error('KaspaExplorer_Rest: canonical Explorer binding is missing or ambiguous')

const kaspaExplorerBinding = kaspaExplorerBindings[0]

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

	throw new Error('KaspaExplorer_Rest: unsupported network')
}

export default {
	source: Source.KaspaExplorer_Rest,

	resolvers: [
		defineResolver(Source.KaspaExplorer_Rest, {
			entityType: EntityType.KaspaAddress,
			resolve: {
				[KaspaAddressSelector.NetworkAddress]: {
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
							getAddressBalance(kaspaExplorerBinding, address.address),
							getAddressTransactionCount(kaspaExplorerBinding, address.address),
							getAddressUtxoCount(kaspaExplorerBinding, address.address),
						])
						return [{
							[EntityMetaKey.Selector]: {
								$address: address,
								timestampMs: Date.now(),
								source: Source.KaspaExplorer_Rest,
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

		defineResolver(Source.KaspaExplorer_Rest, {
			entityType: EntityType.KaspaAddress,
			resolve: {
				[KaspaAddressSelector.NetworkAddress]: {
					appliesTo: kaspaAddressApplicability,
					resolve: async (address, context) => {
						assertKaspaMainnet(address.$network)
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const { getCompleteAddressUtxos } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						const utxos = await getCompleteAddressUtxos(
							kaspaExplorerBinding,
							address.address
						)
						if (utxos.length > limit)
							throw new Error('KaspaExplorer_Rest: complete UTXO snapshot exceeds the requested row limit')
						const timestampMs = Date.now()
						return utxos.map((utxo) => ({
							[EntityMetaKey.Selector]: {
								$address: address,
								outpointTransactionId: utxo.outpoint.transactionId,
								outpointIndex: utxo.outpoint.index,
								timestampMs,
								source: Source.KaspaExplorer_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'amountSompi')]: (
									utxo.utxoEntry.amount == null ?
										undefined
									:
										BigInt(utxo.utxoEntry.amount)
								),
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'scriptPublicKey')]: utxo.utxoEntry.scriptPublicKey.scriptPublicKey,
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'blockDaaScore')]: (
									utxo.utxoEntry.blockDaaScore == null ?
										undefined
									:
										BigInt(utxo.utxoEntry.blockDaaScore)
								),
								[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'isCoinbase')]: utxo.utxoEntry.isCoinbase,
							},
						}))
					},
				},
			},
		})({
			$$utxos: (utxos) => utxos,
		}),

		defineResolver(Source.KaspaExplorer_Rest, {
			entityType: EntityType.KaspaAddress,
			resolve: {
				[KaspaAddressSelector.NetworkAddress]: {
					appliesTo: kaspaAddressApplicability,
					resolve: async (address, context) => {
						assertKaspaMainnet(address.$network)
						const limit = Math.min(resolverContextRowLimit(context), 500)
						if (limit === 0)
							return {
								before: undefined,
								limit,
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
							throw new Error('KaspaExplorer_Rest: invalid address transaction continuation')

						const { getAddressTransactionsPage } = await import('$/sources/KaspaExplorer/Rest/queries.ts')
						return {
							before,
							limit,
							transactions: await getAddressTransactionsPage(
								kaspaExplorerBinding,
								{
									address: address.address,
									limit,
									before,
								}
							),
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
					if (page.limit === 0 || page.transactions.length < page.limit)
						return {
							operation: 'address-transactions',
							target: address.address,
							terminal: true,
						}

					const before = page.transactions.at(-1)?.block_time
					if (before == null || before === page.before)
						throw new Error('KaspaExplorer_Rest: transaction continuation did not advance')
					return {
						operation: 'address-transactions',
						target: address.address,
						terminal: false,
						token: before.toString(),
					}
				},
			},
		}),
	],
}
