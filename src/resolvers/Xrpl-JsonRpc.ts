import {
	type ProviderContinuation,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { Source } from '$/sources/Source.ts'
import type {
	XrplAccountInfoResult,
	XrplMarker,
} from '$/sources/Xrpl/JsonRpc/types.ts'
import {
	isJsonNumber,
	isJsonObject,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

const assertXrplNetwork = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.xrpl.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.xrpl.caip2.namespace
			&& network.caip2.reference === networkBySlug.xrpl.caip2.reference
		)
	)
		throw new Error('Xrpl_Rippled: unsupported network')
}

const validatedLedgerIndex = (ledgerIndex: number) => {
	if (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0)
		throw new Error('Xrpl_Rippled: malformed validated ledger index')

	return BigInt(ledgerIndex)
}

const validatedAccountInfo = (
	account: EntitySelector<typeof schema, EntityType.XrplAccount>,
	accountInfo: XrplAccountInfoResult
) => {
	if (!accountInfo.validated)
		throw new Error('Xrpl_Rippled: account data is not validated')
	if (accountInfo.account_data.Account !== account.account)
		throw new Error('Xrpl_Rippled: account response does not match the subject')
	if (accountInfo.account_data.LedgerEntryType !== 'AccountRoot')
		throw new Error('Xrpl_Rippled: account response is not an AccountRoot')
	if (accountInfo.ledger_index == null)
		throw new Error('Xrpl_Rippled: account response is missing its validated ledger index')
	if (!/^\d+$/.test(accountInfo.account_data.Balance))
		throw new Error('Xrpl_Rippled: malformed XRP balance')
	if (
		!Number.isSafeInteger(accountInfo.account_data.OwnerCount)
		|| accountInfo.account_data.OwnerCount < 0
		|| !Number.isSafeInteger(accountInfo.account_data.Sequence)
		|| accountInfo.account_data.Sequence < 0
		|| !Number.isSafeInteger(accountInfo.account_data.Flags)
		|| accountInfo.account_data.Flags < 0
	)
		throw new Error('Xrpl_Rippled: malformed account counters')

	return {
		ledgerIndex: validatedLedgerIndex(accountInfo.ledger_index),
		balanceDrops: BigInt(accountInfo.account_data.Balance),
		ownerCount: accountInfo.account_data.OwnerCount,
		sequence: accountInfo.account_data.Sequence,
		flags: accountInfo.account_data.Flags,
	}
}

const continuationMarker = (
	token: string | undefined
) => {
	if (token == null)
		return undefined

	const marker = JSON.parse(token) as JsonValue
	if (marker == null)
		throw new Error('Xrpl_Rippled: invalid continuation marker')

	return marker
}

const accountContinuation = (
	operation: string,
	account: string,
	marker: XrplMarker | undefined,
	currentToken: string | undefined
): ProviderContinuation => {
	if (marker == null)
		return {
			operation,
			target: account,
			terminal: true,
		}

	const token = JSON.stringify(marker)
	if (token === currentToken)
		throw new Error(`Xrpl_Rippled: ${operation} continuation did not advance`)

	return {
		operation,
		target: account,
		terminal: false,
		token,
	}
}

const validatedLedgerData = async (context: Parameters<typeof resolverContextRowLimit>[0]) => {
	const continuation = context.providerContinuationToken == null ?
		undefined
	:
		JSON.parse(context.providerContinuationToken) as JsonValue
	if (
		continuation != null
		&& (
			!isJsonObject(continuation)
			|| !isJsonNumber(continuation.ledgerIndex)
			|| !Number.isSafeInteger(continuation.ledgerIndex)
			|| continuation.ledgerIndex < 0
			|| continuation.marker == null
			|| Object.keys(continuation).some((key) => (
				key !== 'ledgerIndex' && key !== 'marker'
			))
		)
	)
		throw new Error('Xrpl_Rippled: invalid ledger data continuation')

	const { getValidatedLedgerData } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
	const ledgerData = await getValidatedLedgerData(
		resolverContextRowLimit(context),
		continuation == null ? 'validated' : continuation.ledgerIndex,
		continuation?.marker
	)
	if (
		continuation != null
		&& ledgerData.ledger_index !== continuation.ledgerIndex
	)
		throw new Error('Xrpl_Rippled: ledger data continuation changed ledgers')

	return {
		ledgerData,
		ledgerIndex: validatedLedgerIndex(ledgerData.ledger_index),
	}
}

const ledgerDataContinuation = (
	ledgerIndex: bigint,
	marker: XrplMarker | undefined,
	currentToken: string | undefined
): ProviderContinuation => {
	if (marker == null)
		return {
			operation: 'validated-ledger-data',
			target: networkBySlug.xrpl.slug,
			terminal: true,
		}
	if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Xrpl_Rippled: ledger data continuation index is too large')

	const token = JSON.stringify({
		ledgerIndex: Number(ledgerIndex),
		marker,
	})
	if (token === currentToken)
		throw new Error('Xrpl_Rippled: ledger data continuation did not advance')

	return {
		operation: 'validated-ledger-data',
		target: networkBySlug.xrpl.slug,
		terminal: false,
		token,
	}
}

export default {
	source: Source.Xrpl_Rippled,

	resolvers: [
		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					resolve: async (account) => {
						assertXrplNetwork(account.$network)
						const { getAccountInfo } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const observation = validatedAccountInfo(
							account,
							await getAccountInfo(account.account)
						)

						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								ledgerIndex: observation.ledgerIndex,
								source: Source.Xrpl_Rippled,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: observation.balanceDrops,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: observation.ownerCount,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: observation.sequence,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'flags')]: observation.flags,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplAccount_Timestamp,
			resolve: {
				AccountLedgerIndexSource: {
					resolve: async ({ $account, ledgerIndex, source }) => {
						assertXrplNetwork($account.$network)
						if (source !== Source.Xrpl_Rippled)
							throw new Error('Xrpl_Rippled: account observation source does not match')
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Xrpl_Rippled: account observation ledger index is too large')

						const { getAccountInfo } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const observation = validatedAccountInfo(
							$account,
							await getAccountInfo($account.account, Number(ledgerIndex))
						)
						if (observation.ledgerIndex !== ledgerIndex)
							throw new Error('Xrpl_Rippled: account observation ledger index does not match')

						return observation
					},
				},
			},
		})({
			balanceDrops: (observation) => observation.balanceDrops,
			ownerCount: (observation) => observation.ownerCount,
			sequence: (observation) => observation.sequence,
			flags: (observation) => observation.flags,
		}),

		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					resolve: async (account, context) => {
						assertXrplNetwork(account.$network)
						const { getAccountObjects } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await getAccountObjects(
							account.account,
							limit,
							continuationMarker(context.providerContinuationToken)
						)
						if (!response.validated)
							throw new Error('Xrpl_Rippled: account objects are not validated')
						if (response.account !== account.account)
							throw new Error('Xrpl_Rippled: account objects do not match the subject')
						if (response.ledger_index == null)
							throw new Error('Xrpl_Rippled: account objects are missing their validated ledger index')
						if (new Set(response.account_objects.map(({ index }) => index)).size !== response.account_objects.length)
							throw new Error('Xrpl_Rippled: account objects contain duplicate identities')

						return {
							ledgerIndex: validatedLedgerIndex(response.ledger_index),
							marker: response.marker,
							objects: response.account_objects.slice(0, limit),
						}
					},
				},
			},
		})({
			$$ledgerEntries: {
				select: (page, account) => page.objects.map((entry) => {
					if (entry.index.length === 0 || entry.LedgerEntryType.length === 0)
						throw new Error('Xrpl_Rippled: account object is missing its ledger identity')

					return {
						[EntityMetaKey.Selector]: {
							$ledger: {
								$network: account.$network,
								ledgerIndex: page.ledgerIndex,
							},
							entryHash: entry.index,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'entryType')]: entry.LedgerEntryType,
							...(entry.Account != null && {
								[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'account')]: entry.Account,
							}),
							...(entry.PreviousTxnID != null && {
								[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionHash')]: entry.PreviousTxnID,
							}),
							...(entry.PreviousTxnLgrSeq != null && {
								[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionLedgerIndex')]: validatedLedgerIndex(entry.PreviousTxnLgrSeq),
							}),
							[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'fields')]: entry,
						},
					}
				}),
				continuation: (page, account, context) => accountContinuation(
					'account-objects',
					account.account,
					page.marker,
					context.providerContinuationToken
				),
			},
		}),

		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					resolve: async (account, context) => {
						assertXrplNetwork(account.$network)
						const { getAccountTransactions } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await getAccountTransactions(
							account.account,
							limit,
							continuationMarker(context.providerContinuationToken)
						)
						if (!response.validated)
							throw new Error('Xrpl_Rippled: account transactions are not validated')
						if (response.account !== account.account)
							throw new Error('Xrpl_Rippled: account transactions do not match the subject')

						return {
							marker: response.marker,
							transactions: response.transactions.slice(0, limit).map((transaction) => {
								if (!transaction.validated)
									throw new Error('Xrpl_Rippled: account transaction is not validated')

								const transactionJson = transaction.tx_json ?? transaction.tx
								if (transactionJson == null)
									throw new Error('Xrpl_Rippled: account transaction is missing JSON fields')
								const hash = transaction.hash ?? transactionJson.hash
								if (
									hash == null
									|| hash.length === 0
									|| transactionJson.TransactionType.length === 0
									|| transactionJson.Account.length === 0
								)
									throw new Error('Xrpl_Rippled: account transaction is missing its identity')
								if (
									transactionJson.Sequence != null
									&& (!Number.isSafeInteger(transactionJson.Sequence) || transactionJson.Sequence < 0)
								)
									throw new Error('Xrpl_Rippled: account transaction has a malformed sequence')
								if (transactionJson.Fee != null && !/^\d+$/.test(transactionJson.Fee))
									throw new Error('Xrpl_Rippled: account transaction has a malformed fee')

								const timestampMs = (
									transaction.close_time_iso != null ?
										Date.parse(transaction.close_time_iso)
									: transactionJson.date != null ?
										(transactionJson.date + 946_684_800) * 1_000
									:
										undefined
								)
								if (timestampMs != null && !Number.isSafeInteger(timestampMs))
									throw new Error('Xrpl_Rippled: account transaction has a malformed close time')

								const ledgerIndex = validatedLedgerIndex(transaction.ledger_index)
								const transactionSelector = {
									$network: account.$network,
									hash,
								}
								return {
									[EntityMetaKey.Selector]: transactionSelector,
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.XrplTransaction, [], 'transactionType')]: transactionJson.TransactionType,
										[entityFieldAddressKey(EntityType.XrplTransaction, [], 'account')]: transactionJson.Account,
										...(transactionJson.Sequence != null && {
											[entityFieldAddressKey(EntityType.XrplTransaction, [], 'sequence')]: transactionJson.Sequence,
										}),
										[entityFieldAddressKey(EntityType.XrplTransaction, [], '$$timestamps')]: [{
											[EntityMetaKey.Selector]: {
												$transaction: transactionSelector,
												ledgerIndex,
												source: Source.Xrpl_Rippled,
											},
											[EntityMetaKey.Fields]: {
												...(timestampMs != null && {
													[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: timestampMs,
												}),
												...(transactionJson.Fee != null && {
													[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: BigInt(transactionJson.Fee),
												}),
												...(transaction.meta.TransactionResult != null && {
													[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')]: transaction.meta.TransactionResult,
													[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')]: transaction.meta.TransactionResult,
												}),
												[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: true,
												[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')]: transaction.meta,
											},
										}],
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page) => page.transactions,
				continuation: (page, account, context) => accountContinuation(
					'account-transactions',
					account.account,
					page.marker,
					context.providerContinuationToken
				),
			},
		}),

		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					resolve: async (account, context) => {
						assertXrplNetwork(account.$network)
						const { getAccountLines } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await getAccountLines(
							account.account,
							limit,
							continuationMarker(context.providerContinuationToken)
						)
						if (!response.validated)
							throw new Error('Xrpl_Rippled: account trustlines are not validated')
						if (response.account !== account.account)
							throw new Error('Xrpl_Rippled: account trustlines do not match the subject')
						if (response.ledger_index == null)
							throw new Error('Xrpl_Rippled: account trustlines are missing their validated ledger index')
						if (new Set(response.lines.map(({ account: issuer, currency }) => (
							`${issuer}:${currency}`
						))).size !== response.lines.length)
							throw new Error('Xrpl_Rippled: account trustlines contain duplicate identities')

						return {
							ledgerIndex: validatedLedgerIndex(response.ledger_index),
							lines: response.lines.slice(0, limit),
							marker: response.marker,
						}
					},
				},
			},
		})({
			$$trustlines: {
				select: (page, account) => page.lines.map((line) => {
					if (line.account.length === 0 || line.currency.length === 0)
						throw new Error('Xrpl_Rippled: account trustline is missing its identity')
					if (
						![line.balance, line.limit, line.limit_peer].every((value) => (
							/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
						))
					)
						throw new Error('Xrpl_Rippled: account trustline has a malformed amount')

					const trustlineSelector = {
						$network: account.$network,
						account: account.account,
						currency: line.currency,
						issuer: line.account,
					}
					return {
						[EntityMetaKey.Selector]: trustlineSelector,
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.XrplTrustline, [], '$account')]: {
								[EntityMetaKey.Selector]: account,
							},
							[entityFieldAddressKey(EntityType.XrplTrustline, [], '$issuerAccount')]: {
								[EntityMetaKey.Selector]: {
									$network: account.$network,
									account: line.account,
								},
							},
							[entityFieldAddressKey(EntityType.XrplTrustline, [], '$$timestamps')]: [{
								[EntityMetaKey.Selector]: {
									$trustline: trustlineSelector,
									ledgerIndex: page.ledgerIndex,
									source: Source.Xrpl_Rippled,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'balance')]: line.balance,
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'limit')]: line.limit,
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'limitPeer')]: line.limit_peer,
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'noRipple')]: line.no_ripple ?? false,
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'noRipplePeer')]: line.no_ripple_peer ?? false,
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'authorized')]: line.authorized ?? false,
									[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'peerAuthorized')]: line.peer_authorized ?? false,
								},
							}],
						},
					}
				}),
				continuation: (page, account, context) => accountContinuation(
					'account-trustlines',
					account.account,
					page.marker,
					context.providerContinuationToken
				),
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network) => {
						assertXrplNetwork(network)

						const { getValidatedLedger } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const ledger = await getValidatedLedger()
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { ledgerData, ledgerIndex } = await validatedLedgerData(context)
						return {
							accounts: ledgerData.state
							.filter((entry) => entry.LedgerEntryType === 'AccountRoot' && entry.Account != null && entry.Account.length > 0)
							.slice(0, resolverContextRowLimit(context))
							.map((entry) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									account: entry.Account,
								},
							})),
							ledgerIndex,
							marker: ledgerData.marker,
						}
					},
				},
			},
		})({
			Xrpl: {
				$$accounts: {
					select: (page) => page.accounts,
					continuation: (page, _network, context) => ledgerDataContinuation(
						page.ledgerIndex,
						page.marker,
						context.providerContinuationToken
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { getFeatures } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const features = await getFeatures()
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { ledgerData, ledgerIndex } = await validatedLedgerData(context)
						return {
							amms: ledgerData.state
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
							.slice(0, resolverContextRowLimit(context)),
							ledgerIndex,
							marker: ledgerData.marker,
						}
					},
				},
			},
		})({
			Xrpl: {
				$$amms: {
					select: (page) => page.amms,
					continuation: (page, _network, context) => ledgerDataContinuation(
						page.ledgerIndex,
						page.marker,
						context.providerContinuationToken
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { ledgerData, ledgerIndex } = await validatedLedgerData(context)
						return {
							ledgerEntries: ledgerData.state
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
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'entryType')]: entry.LedgerEntryType,
									...(entry.Account != null && {
										[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'account')]: entry.Account,
									}),
									...(entry.PreviousTxnID != null && {
										[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionHash')]: entry.PreviousTxnID,
									}),
									...(entry.PreviousTxnLgrSeq != null && {
										[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionLedgerIndex')]: BigInt(entry.PreviousTxnLgrSeq),
									}),
									[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'fields')]: entry,
								},
							})),
							ledgerIndex,
							marker: ledgerData.marker,
						}
					},
				},
			},
		})({
			Xrpl: {
				$$ledgerEntries: {
					select: (page) => page.ledgerEntries,
					continuation: (page, _network, context) => ledgerDataContinuation(
						page.ledgerIndex,
						page.marker,
						context.providerContinuationToken
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplNetwork(network)
						const { getValidatedLedgerTransactions } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const ledger = await getValidatedLedgerTransactions()
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
} satisfies RegisteredSourceResolverModule
