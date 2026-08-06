import {
	type ProviderContinuation,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { Source } from '$/sources/Source.ts'
import type {
	XrpScanAmm,
	XrpScanLedger,
	XrpScanTransaction,
} from '$/sources/XrpScan/Rest/types.ts'

const assertXrplMainnet = (network: {
	caip2?: {
		namespace: string
		reference: string
	}
	slug?: string
}) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.xrpl.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2 != null
			&& network.caip2.namespace === networkBySlug.xrpl.caip2.namespace
			&& network.caip2.reference === networkBySlug.xrpl.caip2.reference
		)
	)
		throw new Error('XrpScan_Rest: unsupported network')
}

const validatedLedgerIndex = (ledgerIndex: number) => {
	if (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0)
		throw new Error('XrpScan_Rest: malformed ledger index')
	return BigInt(ledgerIndex)
}

const tipLedgerIndexFromServerInfo = async () => {
	const { getServerInfo } = await import('$/sources/XrpScan/Rest/queries.ts')
	const serverInfo = await getServerInfo()
	const tip = serverInfo.info.validated_ledger
	if (tip == null)
		throw new Error('XrpScan_Rest: server_info is missing validated ledger')
	return validatedLedgerIndex(tip.seq)
}

const dropsBalance = (balance: string) => {
	if (!/^(?:0|[1-9]\d*)$/.test(balance))
		throw new Error('XrpScan_Rest: malformed XRP balance')
	return BigInt(balance)
}

const feeDrops = (fee: string | number | undefined) => {
	if (fee == null)
		return undefined
	const text = String(fee)
	if (!/^(?:0|[1-9]\d*)$/.test(text))
		throw new Error('XrpScan_Rest: malformed fee')
	return BigInt(text)
}

const closeTimeMs = (ledger: XrpScanLedger) => {
	if (ledger.close_time == null)
		return undefined
	if (!Number.isSafeInteger(ledger.close_time) || ledger.close_time < 0)
		throw new Error('XrpScan_Rest: malformed ledger close time')
	const timestampMs = ledger.close_time * 1_000
	if (!Number.isSafeInteger(timestampMs))
		throw new Error('XrpScan_Rest: malformed ledger close time')
	if (
		ledger.close_time_human != null
		&& Date.parse(ledger.close_time_human) !== timestampMs
	)
		throw new Error('XrpScan_Rest: ledger close time does not match close_time_human')
	return timestampMs
}

const totalCoinsDrops = (totalCoins: XrpScanLedger['total_coins']) => {
	if (totalCoins == null)
		return undefined
	const text = String(totalCoins)
	if (!/^(?:0|[1-9]\d*)$/.test(text))
		throw new Error('XrpScan_Rest: malformed total coins')
	return BigInt(text)
}

const ammAmountParts = (
	amount: XrpScanAmm['amount']
) => (
	typeof amount === 'string' ?
		{
			currency: 'XRP',
			value: amount,
		}
	:
		{
			currency: amount.currency,
			...(amount.issuer != null && amount.issuer.length > 0 && {
				issuer: amount.issuer,
			}),
			value: amount.value,
		}
)

const transactionTimestampMs = (transaction: XrpScanTransaction) => {
	if (transaction.date == null)
		return undefined
	const timestampMs = Date.parse(transaction.date)
	if (!Number.isSafeInteger(timestampMs))
		throw new Error('XrpScan_Rest: malformed transaction date')
	return timestampMs
}

const projectTransaction = (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	transaction: XrpScanTransaction
) => {
	if (
		transaction.hash.length === 0
		|| transaction.TransactionType.length === 0
		|| transaction.Account.length === 0
	)
		throw new Error('XrpScan_Rest: transaction is missing its identity')
	if (transaction.ledger_index == null)
		throw new Error('XrpScan_Rest: transaction is missing its ledger index')

	const ledgerIndex = validatedLedgerIndex(transaction.ledger_index)
	const timestampMs = transactionTimestampMs(transaction)
	const fee = feeDrops(transaction.Fee)
	const transactionSelector = {
		$network: network,
		hash: transaction.hash,
	}

	return {
		[EntityMetaKey.Selector]: transactionSelector,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.XrplTransaction, [], 'transactionType')]: transaction.TransactionType,
			[entityFieldAddressKey(EntityType.XrplTransaction, [], 'account')]: transaction.Account,
			...(transaction.Sequence != null && {
				[entityFieldAddressKey(EntityType.XrplTransaction, [], 'sequence')]: transaction.Sequence,
			}),
			[entityFieldAddressKey(EntityType.XrplTransaction, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$transaction: transactionSelector,
					ledgerIndex,
					source: Source.XrpScan_Rest,
				},
				[EntityMetaKey.Fields]: {
					...(timestampMs != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: timestampMs,
					}),
					...(fee != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: fee,
					}),
					...(transaction.meta?.TransactionResult != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')]: transaction.meta.TransactionResult,
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')]: transaction.meta.TransactionResult,
					}),
					...(transaction.validated != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: transaction.validated,
					}),
					...(transaction.meta != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')]: transaction.meta,
					}),
				},
			}],
		},
	}
}

const accountTransactionsContinuation = (
	account: string,
	marker: string | undefined,
	currentToken: string | undefined
): ProviderContinuation => {
	if (marker == null) {
		if (currentToken == null)
			return {
				operation: 'account-transactions',
				target: account,
				terminal: true,
			}
		throw new Error('XrpScan_Rest: account transactions continuation did not advance')
	}
	if (marker === currentToken)
		throw new Error('XrpScan_Rest: account transactions continuation did not advance')
	return {
		operation: 'account-transactions',
		target: account,
		terminal: false,
		token: marker,
	}
}

const projectLedger = (ledger: XrpScanLedger) => {
	const closeMs = closeTimeMs(ledger)
	const coins = totalCoinsDrops(ledger.total_coins)
	return {
		ledgerIndex: validatedLedgerIndex(ledger.ledger_index),
		ledgerHash: ledger.ledger_hash,
		...(closeMs != null && {
			closeTimeMs: closeMs,
		}),
		...(coins != null && {
			totalCoinsDrops: coins,
		}),
		...(ledger.parent_hash != null && ledger.parent_hash.length > 0 && {
			parentHash: ledger.parent_hash,
		}),
		...(ledger.transaction_hash != null && ledger.transaction_hash.length > 0 && {
			transactionHash: ledger.transaction_hash,
		}),
	}
}

export default {
	source: Source.XrpScan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async (account) => {
						assertXrplMainnet(account.$network)

						const { getAccount } = await import('$/sources/XrpScan/Rest/queries.ts')
						const [
							response,
							ledgerIndex,
						] = await Promise.all([
							getAccount(account.account),
							tipLedgerIndexFromServerInfo(),
						])
						const subject = response.Account ?? response.account
						if (subject !== account.account)
							throw new Error('XrpScan_Rest: account response does not match the subject')
						if (response.LedgerEntryType !== 'AccountRoot')
							throw new Error('XrpScan_Rest: account response is not an AccountRoot')
						if (
							!Number.isSafeInteger(response.OwnerCount)
							|| response.OwnerCount < 0
							|| !Number.isSafeInteger(response.Sequence)
							|| response.Sequence < 0
							|| !Number.isSafeInteger(response.Flags)
							|| response.Flags < 0
						)
							throw new Error('XrpScan_Rest: malformed account counters')

						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								ledgerIndex,
								source: Source.XrpScan_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: dropsBalance(response.Balance),
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: response.OwnerCount,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: response.Sequence,
								[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'flags')]: response.Flags,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplAccount,
			resolve: {
				NetworkAccount: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async (account, context) => {
						assertXrplMainnet(account.$network)
						const { getAccountTransactions } = await import('$/sources/XrpScan/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await getAccountTransactions({
							account: account.account,
							limit,
							marker: context.providerContinuationToken,
						})
						if (response.account !== account.account)
							throw new Error('XrpScan_Rest: account transactions do not match the subject')

						return {
							marker: response.marker,
							transactions: response.transactions
								.filter((transaction) => transaction.validated !== false)
								.slice(0, limit)
								.map((transaction) => projectTransaction(account.$network, transaction)),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page) => page.transactions,
				continuation: (page, account, context) => accountTransactionsContinuation(
					account.account,
					page.marker,
					context.providerContinuationToken
				),
			},
		}),

		defineResolver({
			entityType: EntityType.XrplAmm,
			resolve: {
				NetworkAmmAccount: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async (amm) => {
						assertXrplMainnet(amm.$network)

						const { getAmm } = await import('$/sources/XrpScan/Rest/queries.ts')
						const [
							response,
							ledgerIndex,
						] = await Promise.all([
							getAmm(amm.ammAccount),
							tipLedgerIndexFromServerInfo(),
						])
						if (response.account !== amm.ammAccount)
							throw new Error('XrpScan_Rest: amm response does not match the subject')

						const asset = ammAmountParts(response.amount)
						const asset2 = ammAmountParts(response.amount2)
						if (asset.value == null || asset.value.length === 0)
							throw new Error('XrpScan_Rest: malformed amm asset amount')
						if (asset2.value == null || asset2.value.length === 0)
							throw new Error('XrpScan_Rest: malformed amm asset2 amount')

						return {
							assetCurrency: asset.currency,
							...(asset.issuer != null && {
								assetIssuer: asset.issuer,
							}),
							asset2Currency: asset2.currency,
							...(asset2.issuer != null && {
								asset2Issuer: asset2.issuer,
							}),
							...(response.lp_token?.currency != null && response.lp_token.currency.length > 0 && {
								lpTokenCurrency: response.lp_token.currency,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$amm: amm,
									ledgerIndex,
									source: Source.XrpScan_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: asset.value,
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: asset2.value,
									...(response.lp_token?.value != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: response.lp_token.value,
									}),
									...(response.trading_fee != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: response.trading_fee,
									}),
									...(response.auction_slot != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: response.auction_slot,
									}),
									...(response.vote_slots != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: response.vote_slots,
									}),
								},
							}],
						}
					},
				},
			},
		})({
			assetCurrency: (snapshot) => snapshot.assetCurrency,
			assetIssuer: (snapshot) => snapshot.assetIssuer,
			asset2Currency: (snapshot) => snapshot.asset2Currency,
			asset2Issuer: (snapshot) => snapshot.asset2Issuer,
			lpTokenCurrency: (snapshot) => snapshot.lpTokenCurrency,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplLedger,
			resolve: {
				NetworkLedgerIndex: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async ({ $network, ledgerIndex }) => {
						assertXrplMainnet($network)
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('XrpScan_Rest: ledger index is too large')
						const { getLedger } = await import('$/sources/XrpScan/Rest/queries.ts')
						const ledger = projectLedger(await getLedger(Number(ledgerIndex)))
						if (ledger.ledgerIndex !== ledgerIndex)
							throw new Error('XrpScan_Rest: ledger index does not match')
						return ledger
					},
				},
				NetworkLedgerHash: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async ({ $network, ledgerHash }) => {
						assertXrplMainnet($network)
						const { getLedger } = await import('$/sources/XrpScan/Rest/queries.ts')
						const ledger = projectLedger(await getLedger(ledgerHash))
						if (ledger.ledgerHash !== ledgerHash)
							throw new Error('XrpScan_Rest: ledger hash does not match')
						return ledger
					},
				},
			},
		})({
			ledgerHash: (ledger) => ledger.ledgerHash,
			ledgerIndex: (ledger) => ledger.ledgerIndex,
			closeTimeMs: (ledger) => ledger.closeTimeMs,
			totalCoinsDrops: (ledger) => ledger.totalCoinsDrops,
			parentHash: (ledger) => ledger.parentHash,
			transactionHash: (ledger) => ledger.transactionHash,
		}),

		defineResolver({
			entityType: EntityType.XrplLedger,
			resolve: {
				NetworkLedgerIndex: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async ({ $network, ledgerIndex }, context) => {
						assertXrplMainnet($network)
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('XrpScan_Rest: ledger index is too large')
						const { getLedgerTransactions } = await import('$/sources/XrpScan/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (await getLedgerTransactions(Number(ledgerIndex)))
							.slice(0, limit)
							.map((transaction) => projectTransaction($network, {
								...transaction,
								ledger_index: transaction.ledger_index ?? Number(ledgerIndex),
							}))
					},
				},
			},
		})({
			$$transactions: (transactions) => transactions,
		}),

		defineResolver({
			entityType: EntityType.XrplTransaction,
			resolve: {
				NetworkHash: {
					appliesTo: [{
						$network: {
							caip2: networkBySlug.xrpl.caip2,
						},
					}],
					resolve: async (transaction) => {
						assertXrplMainnet(transaction.$network)
						const { getTransaction } = await import('$/sources/XrpScan/Rest/queries.ts')
						const response = await getTransaction(transaction.hash)
						if (response.hash !== transaction.hash)
							throw new Error('XrpScan_Rest: transaction response does not match the subject')
						const projected = projectTransaction(transaction.$network, response)
						return {
							transactionType: response.TransactionType,
							account: response.Account,
							...(response.Sequence != null && {
								sequence: response.Sequence,
							}),
							$$timestamps: projected[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction, [], '$$timestamps')],
						}
					},
				},
			},
		})({
			transactionType: (snapshot) => snapshot.transactionType,
			account: (snapshot) => snapshot.account,
			sequence: (snapshot) => snapshot.sequence,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplLedgerEntry,
			resolve: {
				LedgerEntryHash: {
					resolve: async ({ $ledger, entryHash }) => {
						assertXrplMainnet($ledger.$network)
						const { getObject } = await import('$/sources/XrpScan/Rest/queries.ts')
						const response = await getObject(entryHash)
						if (!response.validated)
							throw new Error('XrpScan_Rest: ledger object is not validated')
						if (response.index !== entryHash)
							throw new Error('XrpScan_Rest: ledger object does not match the subject')
						if (
							'ledgerIndex' in $ledger
							&& $ledger.ledgerIndex != null
							&& validatedLedgerIndex(response.ledger_index) !== $ledger.ledgerIndex
						)
							throw new Error('XrpScan_Rest: ledger object ledger index does not match')
						if (
							'ledgerHash' in $ledger
							&& $ledger.ledgerHash != null
							&& response.ledger_hash !== $ledger.ledgerHash
						)
							throw new Error('XrpScan_Rest: ledger object ledger hash does not match')

						return {
							entryType: response.node.LedgerEntryType,
							...(response.node.Account != null && {
								account: response.node.Account,
							}),
							...(response.node.PreviousTxnID != null && {
								previousTransactionHash: response.node.PreviousTxnID,
							}),
							...(response.node.PreviousTxnLgrSeq != null && {
								previousTransactionLedgerIndex: validatedLedgerIndex(response.node.PreviousTxnLgrSeq),
							}),
							fields: response.node,
						}
					},
				},
			},
		})({
			entryType: (entry) => entry.entryType,
			account: (entry) => entry.account,
			previousTransactionHash: (entry) => entry.previousTransactionHash,
			previousTransactionLedgerIndex: (entry) => entry.previousTransactionLedgerIndex,
			fields: (entry) => entry.fields,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplMainnet(network)
						const { getLedgers } = await import('$/sources/XrpScan/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await getLedgers()
						return response.ledgers
							.slice(0, limit)
							.map((ledger) => {
								const projected = projectLedger(ledger)
								return {
									[EntityMetaKey.Selector]: {
										$network: network,
										ledgerIndex: projected.ledgerIndex,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.XrplLedger, [], 'ledgerHash')]: projected.ledgerHash,
										...(projected.closeTimeMs != null && {
											[entityFieldAddressKey(EntityType.XrplLedger, [], 'closeTimeMs')]: projected.closeTimeMs,
										}),
										...(projected.totalCoinsDrops != null && {
											[entityFieldAddressKey(EntityType.XrplLedger, [], 'totalCoinsDrops')]: projected.totalCoinsDrops,
										}),
										...(projected.parentHash != null && {
											[entityFieldAddressKey(EntityType.XrplLedger, [], 'parentHash')]: projected.parentHash,
										}),
										...(projected.transactionHash != null && {
											[entityFieldAddressKey(EntityType.XrplLedger, [], 'transactionHash')]: projected.transactionHash,
										}),
									},
								}
							})
					},
				},
			},
		})({
			Xrpl: {
				$$ledgers: (ledgers) => ledgers,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
