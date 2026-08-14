import { networkBySlug } from '$/constants/Network.ts'
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
import type {
	BithompAmount,
	BithompAmm,
	BithompTransaction,
} from '$/sources/Bithomp/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

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
		throw new Error('Bithomp: unsupported network')
}

const validatedLedgerIndex = (ledgerIndex: number) => {
	if (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0)
		throw new Error('Bithomp: malformed ledger index')
	return BigInt(ledgerIndex)
}

const ledgerTimestampMs = (ledgerTimestamp: number) => {
	if (!Number.isSafeInteger(ledgerTimestamp) || ledgerTimestamp < 0)
		throw new Error('Bithomp: malformed ledger timestamp')
	const timestampMs = ledgerTimestamp * 1_000
	if (!Number.isSafeInteger(timestampMs))
		throw new Error('Bithomp: malformed ledger timestamp')
	return timestampMs
}

const dropsBalance = (balance: string) => {
	if (!/^(?:0|[1-9]\d*)$/.test(balance))
		throw new Error('Bithomp: malformed XRP balance')
	return BigInt(balance)
}

const ammAmountParts = (
	amount: BithompAmount
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

const projectAmmIdentity = (response: BithompAmm) => {
	const asset = ammAmountParts(response.amount)
	const asset2 = ammAmountParts(response.amount2)
	if (
		asset.currency === 'XRP'
		&& !/^(?:0|[1-9]\d*)$/.test(asset.value)
	)
		throw new Error('Bithomp: malformed XRP asset amount')
	if (asset.value.length === 0)
		throw new Error('Bithomp: malformed XRP asset amount')
	if (asset2.currency.length === 0 || asset2.value.length === 0)
		throw new Error('Bithomp: malformed issued asset')

	return {
		assetCurrency: asset.currency,
		...(asset.issuer != null && {
			assetIssuer: asset.issuer,
		}),
		asset2Currency: asset2.currency,
		...(asset2.issuer != null && {
			asset2Issuer: asset2.issuer,
		}),
		...(response.lpTokenBalance?.currency != null && response.lpTokenBalance.currency.length > 0 && {
			lpTokenCurrency: response.lpTokenBalance.currency,
		}),
		assetAmount: asset.value,
		asset2Amount: asset2.value,
	}
}

const projectAmmObservationFields = (response: BithompAmm) => {
	const identity = projectAmmIdentity(response)
	return {
		[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: identity.assetAmount,
		[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: identity.asset2Amount,
		...(response.lpTokenBalance?.value != null && {
			[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: response.lpTokenBalance.value,
		}),
		...(response.tradingFee != null && {
			[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: response.tradingFee,
		}),
		...(response.auctionSlot != null && {
			[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: response.auctionSlot,
		}),
		...(response.voteSlots != null && {
			[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: response.voteSlots,
		}),
	}
}

const ammObservationClock = (response: BithompAmm) => {
	if (response.updatedLedgerIndex == null && response.updatedAt == null)
		return undefined
	if (response.updatedLedgerIndex == null)
		throw new Error('Bithomp: malformed amm ledger index')
	if (response.updatedAt == null)
		throw new Error('Bithomp: malformed amm timestamp')
	if (!Number.isSafeInteger(response.updatedLedgerIndex) || response.updatedLedgerIndex < 0)
		throw new Error('Bithomp: malformed amm ledger index')
	if (
		!Number.isSafeInteger(response.updatedAt)
		|| response.updatedAt < 0
		|| !Number.isSafeInteger(response.updatedAt * 1_000)
	)
		throw new Error('Bithomp: malformed amm timestamp')
	return {
		ledgerIndex: BigInt(response.updatedLedgerIndex),
		timestampMs: response.updatedAt * 1_000,
	}
}

const ammLedgerEntryReference = (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	ledgerIndex: bigint,
	ammID: string
) => ({
	[EntityMetaKey.Selector]: {
		$ledger: {
			$network: network,
			ledgerIndex,
		},
		entryHash: ammID,
	},
})

const tipAccountLedger = async (
	publicEnv: {
		PUBLIC_BITHOMP_API_KEY?: string
		[key: string]: string | undefined
	},
	account: string
) => {
	const { getAccount } = await import('$/sources/Bithomp/Rest/queries.ts')
	const response = await getAccount(publicEnv, {
		address: account,
	})
	if (response.address !== account)
		throw new Error('Bithomp: account response does not match the subject')
	const ledgerInfo = response.ledgerInfo
	if (ledgerInfo == null || ledgerInfo.error != null)
		throw new Error('Bithomp: account response is missing ledger information')
	return {
		response,
		ledgerInfo,
		ledgerIndex: validatedLedgerIndex(ledgerInfo.ledger),
		timestampMs: ledgerTimestampMs(ledgerInfo.ledgerTimestamp),
	}
}

const accountObservationFields = (ledgerInfo: Awaited<ReturnType<typeof tipAccountLedger>>['ledgerInfo']) => ({
	[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'timestampMs')]: ledgerTimestampMs(ledgerInfo.ledgerTimestamp),
	[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'balanceDrops')]: dropsBalance(ledgerInfo.balance),
	[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'ownerCount')]: ledgerInfo.ownerCount,
	[entityFieldAddressKey(EntityType.XrplAccount_Timestamp, [], 'sequence')]: ledgerInfo.sequence,
})

const parseRawTransaction = (rawTransaction: string | undefined) => {
	if (rawTransaction == null)
		return undefined
	try {
		const parsed = JSON.parse(rawTransaction) as {
			hash?: string
			TransactionType?: string
			Account?: string
			Sequence?: number
			Fee?: string
			ledger_index?: number
			meta?: {
				TransactionResult?: string
			}
			validated?: boolean
			date?: number
		}
		return parsed
	} catch {
		throw new Error('Bithomp: malformed raw transaction')
	}
}

const feeDropsFromRawOrOutcome = (
	raw: ReturnType<typeof parseRawTransaction>,
	outcomeFee: string | undefined
) => {
	if (raw?.Fee != null) {
		if (!/^(?:0|[1-9]\d*)$/.test(raw.Fee))
			throw new Error('Bithomp: malformed fee')
		return BigInt(raw.Fee)
	}
	if (outcomeFee == null)
		return undefined
	if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(outcomeFee))
		throw new Error('Bithomp: malformed fee')
	const [
		whole = '0',
		fraction = '',
	] = outcomeFee.split('.')
	const padded = `${fraction}000000`.slice(0, 6)
	if (!/^\d+$/.test(whole) || !/^\d{6}$/.test(padded))
		throw new Error('Bithomp: malformed fee')
	return BigInt(whole) * 1_000_000n + BigInt(padded)
}

const projectTransaction = (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	transaction: BithompTransaction
) => {
	const raw = parseRawTransaction(transaction.rawTransaction)
	const hash = transaction.id ?? transaction.hash ?? raw?.hash
	if (hash == null || hash.length === 0)
		throw new Error('Bithomp: transaction is missing its identity')
	const transactionType = raw?.TransactionType ?? (
		transaction.type == null ?
			undefined
		:
			`${transaction.type.slice(0, 1).toUpperCase()}${transaction.type.slice(1)}`
	)
	const account = raw?.Account ?? transaction.address
	if (transactionType == null || transactionType.length === 0 || account == null || account.length === 0)
		throw new Error('Bithomp: transaction is missing its identity')
	const ledgerIndexValue = transaction.outcome?.ledgerIndex ?? transaction.outcome?.ledgerVersion ?? raw?.ledger_index
	if (ledgerIndexValue == null)
		throw new Error('Bithomp: transaction is missing its ledger index')
	const ledgerIndex = validatedLedgerIndex(ledgerIndexValue)
	const outcomeTimestampMs = (
		transaction.outcome?.timestamp == null ?
			undefined
		:
			Date.parse(transaction.outcome.timestamp)
	)
	if (transaction.outcome?.timestamp != null && !Number.isSafeInteger(outcomeTimestampMs))
		throw new Error('Bithomp: malformed transaction date')
	const timestampMs = (
		outcomeTimestampMs
		?? (
			raw?.date != null ?
				ledgerTimestampMs(raw.date + 946684800)
			:
				undefined
		)
	)
	const fee = feeDropsFromRawOrOutcome(raw, transaction.outcome?.fee)
	const status = transaction.outcome?.result ?? raw?.meta?.TransactionResult
	const transactionSelector = {
		$network: network,
		hash,
	}

	return {
		[EntityMetaKey.Selector]: transactionSelector,
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.XrplTransaction, [], 'transactionType')]: transactionType,
			[entityFieldAddressKey(EntityType.XrplTransaction, [], 'account')]: account,
			...(
				(transaction.sequence ?? raw?.Sequence) != null && {
					[entityFieldAddressKey(EntityType.XrplTransaction, [], 'sequence')]: transaction.sequence ?? raw?.Sequence,
				}
			),
			[entityFieldAddressKey(EntityType.XrplTransaction, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$transaction: transactionSelector,
					ledgerIndex,
					source: Source.Bithomp,
				},
				[EntityMetaKey.Fields]: {
					...(timestampMs != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: timestampMs,
					}),
					...(fee != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: fee,
					}),
					...(status != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')]: status,
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')]: status,
					}),
					...(raw?.validated != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: raw.validated,
					}),
					...(raw?.meta != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')]: raw.meta,
					}),
				},
			}],
		},
	}
}

const markerContinuation = (
	operation: string,
	target: string,
	marker: string | undefined,
	currentToken: string | undefined
): ProviderContinuation => {
	if (marker == null) {
		if (currentToken == null)
			return {
				operation,
				target,
				terminal: true,
			}
		throw new Error('Bithomp: continuation did not advance')
	}
	if (marker === currentToken)
		throw new Error('Bithomp: continuation did not advance')
	return {
		operation,
		target,
		terminal: false,
		token: marker,
	}
}

export default {
	source: Source.Bithomp,

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
					resolve: async (account, context) => {
						assertXrplMainnet(account.$network)
						const tip = await tipAccountLedger(context.publicEnv, account.account)
						return [{
							[EntityMetaKey.Selector]: {
								$account: account,
								ledgerIndex: tip.ledgerIndex,
								source: Source.Bithomp,
							},
							[EntityMetaKey.Fields]: accountObservationFields(tip.ledgerInfo),
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
					resolve: async ({ $account, ledgerIndex, source }, context) => {
						assertXrplMainnet($account.$network)
						if (source !== Source.Bithomp)
							throw new Error('Bithomp: account observation source does not match')

						const tip = await tipAccountLedger(context.publicEnv, $account.account)
						if (ledgerIndex !== tip.ledgerIndex)
							throw new Error('Bithomp: account observation is not the tip ledger')

						return {
							timestampMs: tip.timestampMs,
							balanceDrops: dropsBalance(tip.ledgerInfo.balance),
							ownerCount: tip.ledgerInfo.ownerCount,
							sequence: tip.ledgerInfo.sequence,
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			balanceDrops: (observation) => observation.balanceDrops,
			ownerCount: (observation) => observation.ownerCount,
			sequence: (observation) => observation.sequence,
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
						const { getTrustlines } = await import('$/sources/Bithomp/Rest/queries.ts')
						const tip = await tipAccountLedger(context.publicEnv, account.account)
						const lines = await getTrustlines(context.publicEnv, {
							address: account.account,
						})
						const limit = resolverContextRowLimit(context)
						if (new Set(lines.map(({ counterparty, currency }) => `${counterparty}:${currency}`)).size !== lines.length)
							throw new Error('Bithomp: account trustlines contain duplicate identities')

						return lines
							.slice(0, limit)
							.map((line) => {
								if (
									![
										line.balance,
										line.limit,
										line.peer?.limit ?? '0',
									].every((value) => (
										/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
									))
								)
									throw new Error('Bithomp: account trustline has a malformed amount')

								const trustlineSelector = {
									$network: account.$network,
									account: account.account,
									currency: line.currency,
									issuer: line.counterparty,
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
												account: line.counterparty,
											},
										},
										[entityFieldAddressKey(EntityType.XrplTrustline, [], '$$timestamps')]: [{
											[EntityMetaKey.Selector]: {
												$trustline: trustlineSelector,
												ledgerIndex: tip.ledgerIndex,
												source: Source.Bithomp,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'timestampMs')]: tip.timestampMs,
												[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'balance')]: line.balance,
												[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'limit')]: line.limit,
												...(line.peer?.limit != null && {
													[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'limitPeer')]: line.peer.limit,
												}),
												...(line.ripplingDisabled != null && {
													[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'noRipple')]: line.ripplingDisabled,
												}),
												...(line.peer?.ripplingDisabled != null && {
													[entityFieldAddressKey(EntityType.XrplTrustline_Timestamp, [], 'noRipplePeer')]: line.peer.ripplingDisabled,
												}),
											},
										}],
									},
								}
							})
					},
				},
			},
		})({
			$$trustlines: (trustlines) => trustlines,
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
						const { getAccountTransactions } = await import('$/sources/Bithomp/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const transactions = await getAccountTransactions(context.publicEnv, {
							address: account.account,
							limit,
							startTxHash: context.providerContinuationToken,
						})
						const page = transactions.slice(0, limit)
						const lastHash = page.at(-1)?.id ?? page.at(-1)?.hash
						return {
							transactions: page.map((transaction) => projectTransaction(account.$network, transaction)),
							nextToken: (
								page.length >= limit
								&& lastHash != null
								&& lastHash.length > 0
							) ?
								lastHash
							:
								undefined,
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page) => page.transactions,
				continuation: (page, account, context) => markerContinuation(
					'account-transactions',
					account.account,
					page.nextToken,
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
					resolve: async (amm, context) => {
						assertXrplMainnet(amm.$network)

						const { getAmm } = await import('$/sources/Bithomp/Rest/queries.ts')
						const response = await getAmm(context.publicEnv, {
							id: amm.ammAccount,
						})
						if (response.account !== amm.ammAccount)
							throw new Error('Bithomp: amm response does not match the subject')

						const identity = projectAmmIdentity(response)
						const observationClock = ammObservationClock(response)
						if (observationClock == null)
							throw new Error('Bithomp: amm response is missing its observation clock')

						return {
							assetCurrency: identity.assetCurrency,
							...(identity.assetIssuer != null && {
								assetIssuer: identity.assetIssuer,
							}),
							asset2Currency: identity.asset2Currency,
							...(identity.asset2Issuer != null && {
								asset2Issuer: identity.asset2Issuer,
							}),
							...(identity.lpTokenCurrency != null && {
								lpTokenCurrency: identity.lpTokenCurrency,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$amm: amm,
									ledgerIndex: observationClock.ledgerIndex,
									source: Source.Bithomp,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'timestampMs')]: observationClock.timestampMs,
									...projectAmmObservationFields(response),
									...(response.ammID != null && response.ammID.length > 0 && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], '$ledgerEntry')]: ammLedgerEntryReference(
											amm.$network,
											observationClock.ledgerIndex,
											response.ammID
										),
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
			entityType: EntityType.XrplAmm_Timestamp,
			resolve: {
				AmmLedgerIndexSource: {
					resolve: async ({ $amm, ledgerIndex, source }, context) => {
						assertXrplMainnet($amm.$network)
						if (source !== Source.Bithomp)
							throw new Error('Bithomp: AMM observation source does not match')

						const { getAmm } = await import('$/sources/Bithomp/Rest/queries.ts')
						const response = await getAmm(context.publicEnv, {
							id: $amm.ammAccount,
						})
						if (response.account !== $amm.ammAccount)
							throw new Error('Bithomp: amm response does not match the subject')
						const observationClock = ammObservationClock(response)
						if (observationClock == null)
							throw new Error('Bithomp: amm response is missing its observation clock')
						if (observationClock.ledgerIndex !== ledgerIndex)
							throw new Error('Bithomp: AMM observation is not the tip ledger')

						const identity = projectAmmIdentity(response)
						return {
							timestampMs: observationClock.timestampMs,
							assetAmount: identity.assetAmount,
							asset2Amount: identity.asset2Amount,
							...(response.lpTokenBalance?.value != null && {
								lpTokenBalance: response.lpTokenBalance.value,
							}),
							...(response.tradingFee != null && {
								tradingFee: response.tradingFee,
							}),
							...(response.auctionSlot != null && {
								auctionSlot: response.auctionSlot,
							}),
							...(response.voteSlots != null && {
								voteSlots: response.voteSlots,
							}),
							...(response.ammID != null && response.ammID.length > 0 && {
								$ledgerEntry: ammLedgerEntryReference(
									$amm.$network,
									observationClock.ledgerIndex,
									response.ammID
								),
							}),
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			assetAmount: (observation) => observation.assetAmount,
			asset2Amount: (observation) => observation.asset2Amount,
			lpTokenBalance: (observation) => observation.lpTokenBalance,
			tradingFee: (observation) => observation.tradingFee,
			auctionSlot: (observation) => observation.auctionSlot,
			voteSlots: (observation) => observation.voteSlots,
			$ledgerEntry: (observation) => observation.$ledgerEntry,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplMainnet(network)
						const { getAmms } = await import('$/sources/Bithomp/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const response = await getAmms(context.publicEnv, {
							marker: context.providerContinuationToken,
							limit,
						})
						return {
							marker: response.marker,
							amms: response.amms
								.filter((amm) => amm.account.length > 0)
								.slice(0, limit)
								.map((amm) => {
									const identity = projectAmmIdentity(amm)
									const observationClock = ammObservationClock(amm)
									const ammSelector = {
										$network: network,
										ammAccount: amm.account,
									}
									return {
										[EntityMetaKey.Selector]: ammSelector,
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.XrplAmm, [], 'assetCurrency')]: identity.assetCurrency,
											...(identity.assetIssuer != null && {
												[entityFieldAddressKey(EntityType.XrplAmm, [], 'assetIssuer')]: identity.assetIssuer,
											}),
											[entityFieldAddressKey(EntityType.XrplAmm, [], 'asset2Currency')]: identity.asset2Currency,
											...(identity.asset2Issuer != null && {
												[entityFieldAddressKey(EntityType.XrplAmm, [], 'asset2Issuer')]: identity.asset2Issuer,
											}),
											...(identity.lpTokenCurrency != null && {
												[entityFieldAddressKey(EntityType.XrplAmm, [], 'lpTokenCurrency')]: identity.lpTokenCurrency,
											}),
											...(observationClock != null && {
												[entityFieldAddressKey(EntityType.XrplAmm, [], '$$timestamps')]: [{
													[EntityMetaKey.Selector]: {
														$amm: ammSelector,
														ledgerIndex: observationClock.ledgerIndex,
														source: Source.Bithomp,
													},
													[EntityMetaKey.Fields]: {
														[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'timestampMs')]: observationClock.timestampMs,
														...projectAmmObservationFields(amm),
														...(amm.ammID != null && amm.ammID.length > 0 && {
															[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], '$ledgerEntry')]: ammLedgerEntryReference(
																network,
																observationClock.ledgerIndex,
																amm.ammID
															),
														}),
													},
												}],
											}),
										},
									}
								}),
						}
					},
				},
			},
		})({
			Xrpl: {
				$$amms: {
					select: (page) => page.amms,
					continuation: (page, network, context) => markerContinuation(
						'network-amms',
						'caip2' in network && network.caip2 != null ?
							`${network.caip2.namespace}:${network.caip2.reference}`
						:
							'xrpl',
						page.marker,
						context.providerContinuationToken
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.XrplLedgerEntry,
			resolve: {
				LedgerEntryHash: {
					resolve: async ({ $ledger, entryHash }, context) => {
						assertXrplMainnet($ledger.$network)
						const { getLedgerEntry } = await import('$/sources/Bithomp/Rest/queries.ts')
						const response = await getLedgerEntry(context.publicEnv, {
							index: entryHash,
							...(
								'ledgerIndex' in $ledger
								&& $ledger.ledgerIndex != null
								&& $ledger.ledgerIndex <= BigInt(Number.MAX_SAFE_INTEGER)
								&& {
									ledgerIndex: Number($ledger.ledgerIndex),
								}
							),
						})
						if (!response.validated)
							throw new Error('Bithomp: ledger entry is not validated')
						if (response.index !== entryHash)
							throw new Error('Bithomp: ledger entry does not match the subject')
						if (
							'ledgerIndex' in $ledger
							&& $ledger.ledgerIndex != null
							&& validatedLedgerIndex(response.ledger_index) !== $ledger.ledgerIndex
						)
							throw new Error('Bithomp: ledger entry ledger index does not match')
						if (
							'ledgerHash' in $ledger
							&& $ledger.ledgerHash != null
							&& response.ledger_hash !== $ledger.ledgerHash
						)
							throw new Error('Bithomp: ledger entry ledger hash does not match')

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
	],
} satisfies RegisteredSourceResolverModule
