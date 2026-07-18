import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const xrplRippledBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Xrpl_Rippled)

if (xrplRippledBinding == null)
	throw new Error('Xrpl_Rippled: source binding is missing')

const assertXrplNetwork = (network: { caip2: {
	namespace: string
	reference: string
} }) => {
	if (
		network.caip2.namespace !== networkBySlug.xrpl.caip2.namespace
		|| network.caip2.reference !== networkBySlug.xrpl.caip2.reference
	)
		throw new Error('Xrpl_Rippled: unsupported network')
}

const validatedLedgerIndex = (ledgerIndex: number) => {
	if (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0)
		throw new Error('Xrpl_Rippled: malformed validated ledger index')

	return BigInt(ledgerIndex)
}

const validatedLedgerData = async (context: Parameters<typeof resolverContextRowLimit>[0]) => {
	const { getValidatedLedgerData } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
	const ledgerData = await getValidatedLedgerData(xrplRippledBinding, resolverContextRowLimit(context))
	return {
		ledgerData,
		ledgerIndex: validatedLedgerIndex(ledgerData.ledger_index),
	}
}

export default {
	source: Source.Xrpl_Rippled,

	resolvers: [
		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertXrplNetwork(network)

						const { getValidatedLedger } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const ledger = await getValidatedLedger(xrplRippledBinding)
						if (!ledger.validated)
							throw new Error('Xrpl_Rippled: ledger is not validated')
						if (!Number.isSafeInteger(ledger.ledger_index) || ledger.ledger_index < 0)
							throw new Error('Xrpl_Rippled: malformed validated ledger index')
						if (ledger.ledger_hash.length === 0)
							throw new Error('Xrpl_Rippled: malformed validated ledger hash')

						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									ledgerIndex: BigInt(ledger.ledger_index),
								},
							},
						]
					},
				},
			},
		})({
			Xrpl: {
				$$ledgers: (ledgers) => ledgers,
			},
		}),

		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { ledgerData } = await validatedLedgerData(context)
						return ledgerData.state
							.filter((entry) => entry.LedgerEntryType === 'AccountRoot' && entry.Account != null && entry.Account.length > 0)
							.slice(0, resolverContextRowLimit(context))
							.map((entry) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									account: entry.Account,
								},
							}))
					},
				},
			},
		})({
			Xrpl: {
				$$accounts: (accounts) => accounts,
			},
		}),

		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { getFeatures } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const features = await getFeatures(xrplRippledBinding)
						return Object.entries(features)
							.filter(([amendmentId]) => amendmentId.length > 0)
							.slice(0, resolverContextRowLimit(context))
							.map(([amendmentId, feature]) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									amendmentId,
								},
								...(feature.name != null && {
									name: feature.name,
								}),
							}))
					},
				},
			},
		})({
			Xrpl: {
				$$amendments: (amendments) => amendments,
			},
		}),

		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { ledgerData } = await validatedLedgerData(context)
						return ledgerData.state
							.filter((entry) => (
								entry.LedgerEntryType === 'AMM'
								&& entry.Account != null
								&& entry.Asset != null
								&& entry.Asset2 != null
								&& entry.Asset.currency.length > 0
								&& entry.Asset2.currency.length > 0
							))
							.map((entry) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									ammAccount: entry.Account,
								},
								assetCurrency: entry.Asset.currency,
								...(entry.Asset.issuer != null && {
									assetIssuer: entry.Asset.issuer,
								}),
								asset2Currency: entry.Asset2.currency,
								...(entry.Asset2.issuer != null && {
									asset2Issuer: entry.Asset2.issuer,
								}),
								...(entry.LPTokenBalance?.currency != null && {
									lpTokenCurrency: entry.LPTokenBalance.currency,
								}),
							}))
							.slice(0, resolverContextRowLimit(context))
					},
				},
			},
		})({
			Xrpl: {
				$$amms: (amms) => amms,
			},
		}),

		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { ledgerData, ledgerIndex } = await validatedLedgerData(context)
						return ledgerData.state
							.filter((entry) => entry.index.length > 0)
							.slice(0, resolverContextRowLimit(context))
							.map((entry) => ({
								[EntityMetaKey.Selector]: {
									$ledger: {
										$network: network,
										ledgerIndex,
									},
									entryHash: entry.index,
								},
								entryType: entry.LedgerEntryType,
								...(entry.Account != null && {
									account: entry.Account,
								}),
								...(entry.PreviousTxnID != null && {
									previousTransactionHash: entry.PreviousTxnID,
								}),
								...(entry.PreviousTxnLgrSeq != null && {
									previousTransactionLedgerIndex: BigInt(entry.PreviousTxnLgrSeq),
								}),
								fields: entry,
							}))
					},
				},
			},
		})({
			Xrpl: {
				$$ledgerEntries: (ledgerEntries) => ledgerEntries,
			},
		}),

		defineResolver(Source.Xrpl_Rippled, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { getValidatedLedgerTransactions } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const ledger = await getValidatedLedgerTransactions(xrplRippledBinding)
						if (!ledger.validated)
							throw new Error('Xrpl_Rippled: ledger is not validated')
						validatedLedgerIndex(ledger.ledger_index)
						return (ledger.transactions ?? [])
							.filter((transaction) => transaction.hash.length > 0 && transaction.TransactionType.length > 0 && transaction.Account.length > 0)
							.slice(0, resolverContextRowLimit(context))
							.map((transaction) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									hash: transaction.hash,
								},
								transactionType: transaction.TransactionType,
								account: transaction.Account,
								...(transaction.Sequence != null && {
									sequence: transaction.Sequence,
								}),
							}))
					},
				},
			},
		})({
			Xrpl: {
				$$transactions: (transactions) => transactions,
			},
		}),
	],
}
