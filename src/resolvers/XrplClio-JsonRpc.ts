import {
	type ProviderContinuation,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { Source } from '$/sources/Source.ts'
import {
	XRPL_RIPPLE_EPOCH_OFFSET_SECONDS,
	type XrplClioLedgerDataResult,
	type XrplClioLedgerResult,
	type XrplClioLedgerWithTransactionsResult,
	type XrplClioMarker,
	type XrplClioTransactionResult,
} from '$/sources/XrplClio/JsonRpc/types.ts'
import {
	isJsonNumber,
	isJsonString,
} from '$/typescript/JsonValue.ts'

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
		throw new Error('XrplClio_JsonRpc: unsupported network')
}

const validatedLedgerIndex = (ledgerIndex: number) => {
	if (!Number.isSafeInteger(ledgerIndex) || ledgerIndex < 0)
		throw new Error('XrplClio_JsonRpc: malformed ledger index')
	return BigInt(ledgerIndex)
}

const assertValidatedLedger = (
	ledger: XrplClioLedgerResult
) => {
	if (!ledger.validated)
		throw new Error('XrplClio_JsonRpc: ledger is not validated')
	if (ledger.ledger_hash.length === 0)
		throw new Error('XrplClio_JsonRpc: malformed validated ledger hash')
	return ledger
}

const ledgerCloseTimeMs = (
	ledgerBody: NonNullable<XrplClioLedgerResult['ledger']> | undefined
) => {
	if (ledgerBody?.close_time == null)
		return undefined
	if (!Number.isSafeInteger(ledgerBody.close_time) || ledgerBody.close_time < 0)
		throw new Error('XrplClio_JsonRpc: malformed ledger close time')

	const timestampMs = (
		ledgerBody.close_time
		+ XRPL_RIPPLE_EPOCH_OFFSET_SECONDS
	) * 1_000
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('XrplClio_JsonRpc: malformed ledger close time')

	if (ledgerBody.close_time_human != null) {
		const parsed = Date.parse(ledgerBody.close_time_human)
		if (Number.isSafeInteger(parsed) && parsed !== timestampMs)
			throw new Error('XrplClio_JsonRpc: ledger close time does not match close_time_human')
	}

	return timestampMs
}

const ledgerTotalCoinsDrops = (
	totalCoins: NonNullable<XrplClioLedgerResult['ledger']>['total_coins'] | undefined
) => {
	if (totalCoins == null)
		return undefined
	if (!/^(?:0|[1-9]\d*)$/.test(totalCoins))
		throw new Error('XrplClio_JsonRpc: malformed total coins')
	return BigInt(totalCoins)
}

const xrplLedgerFields = (
	ledger: XrplClioLedgerResult
) => {
	const body = assertValidatedLedger(ledger).ledger
	const closeTimeMs = ledgerCloseTimeMs(body)
	const totalCoinsDrops = ledgerTotalCoinsDrops(body?.total_coins)

	return {
		ledgerHash: ledger.ledger_hash,
		ledgerIndex: BigInt(ledger.ledger_index),
		validated: ledger.validated,
		...(closeTimeMs != null && {
			closeTimeMs,
		}),
		...(totalCoinsDrops != null && {
			totalCoinsDrops,
		}),
		...(body?.parent_hash != null && {
			parentHash: body.parent_hash,
		}),
		...(body?.account_hash != null && {
			accountHash: body.account_hash,
		}),
		...(body?.transaction_hash != null && {
			transactionHash: body.transaction_hash,
		}),
	}
}

const projectLedgerRow = (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	ledger: XrplClioLedgerResult
) => {
	const fields = xrplLedgerFields(ledger)
	return {
		[EntityMetaKey.Selector]: {
			$network: network,
			ledgerIndex: fields.ledgerIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.XrplLedger, [], 'ledgerHash')]: fields.ledgerHash,
			[entityFieldAddressKey(EntityType.XrplLedger, [], 'validated')]: fields.validated,
			...(fields.closeTimeMs != null && {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'closeTimeMs')]: fields.closeTimeMs,
			}),
			...(fields.totalCoinsDrops != null && {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'totalCoinsDrops')]: fields.totalCoinsDrops,
			}),
			...(fields.parentHash != null && {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'parentHash')]: fields.parentHash,
			}),
			...(fields.accountHash != null && {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'accountHash')]: fields.accountHash,
			}),
			...(fields.transactionHash != null && {
				[entityFieldAddressKey(EntityType.XrplLedger, [], 'transactionHash')]: fields.transactionHash,
			}),
		},
	}
}

const resolveXrplLedger = async (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	match: {
		ledgerIndex?: bigint
		ledgerHash?: string
	}
) => {
	assertXrplMainnet(network)
	if (match.ledgerIndex != null && match.ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('XrplClio_JsonRpc: ledger index is too large')

	const { getLedger } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
	const fields = xrplLedgerFields(
		await getLedger(
			match.ledgerHash != null ?
				{
					ledgerHash: match.ledgerHash,
				}
			: match.ledgerIndex != null ?
				Number(match.ledgerIndex)
			:
				'validated'
		)
	)
	if (match.ledgerIndex != null && fields.ledgerIndex !== match.ledgerIndex)
		throw new Error('XrplClio_JsonRpc: validated ledger index does not match')
	if (match.ledgerHash != null && fields.ledgerHash !== match.ledgerHash)
		throw new Error('XrplClio_JsonRpc: validated ledger hash does not match')

	return fields
}

const projectLedgerTransaction = (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	ledgerIndex: bigint,
	transaction: NonNullable<XrplClioLedgerWithTransactionsResult['transactions']>[number]
) => {
	if (
		transaction.hash.length === 0
		|| transaction.TransactionType.length === 0
		|| transaction.Account.length === 0
	)
		throw new Error('XrplClio_JsonRpc: ledger transaction is missing its identity')
	if (transaction.Fee != null && !/^\d+$/.test(transaction.Fee))
		throw new Error('XrplClio_JsonRpc: ledger transaction has a malformed fee')

	const timestampMs = (
		transaction.date != null ?
			(transaction.date + XRPL_RIPPLE_EPOCH_OFFSET_SECONDS) * 1_000
		:
			undefined
	)
	if (timestampMs != null && !Number.isSafeInteger(timestampMs))
		throw new Error('XrplClio_JsonRpc: ledger transaction has a malformed close time')

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
					source: Source.XrplClio_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					...(timestampMs != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: timestampMs,
					}),
					...(transaction.Fee != null && {
						[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: BigInt(transaction.Fee),
					}),
					[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: true,
				},
			}],
		},
	}
}

const projectTransaction = (
	network: {
		caip2?: {
			namespace: string
			reference: string
		}
		slug?: string
	},
	response: XrplClioTransactionResult
) => {
	const transactionJson = response.tx_json ?? response.tx
	if (transactionJson == null)
		throw new Error('XrplClio_JsonRpc: transaction is missing JSON fields')
	if (
		response.hash.length === 0
		|| transactionJson.TransactionType.length === 0
		|| transactionJson.Account.length === 0
	)
		throw new Error('XrplClio_JsonRpc: transaction is missing its identity')
	if (!response.validated)
		throw new Error('XrplClio_JsonRpc: transaction is not validated')
	if (response.ledger_index == null)
		throw new Error('XrplClio_JsonRpc: transaction is missing its ledger index')
	if (transactionJson.Fee != null && !/^\d+$/.test(transactionJson.Fee))
		throw new Error('XrplClio_JsonRpc: transaction has a malformed fee')

	const ledgerIndex = validatedLedgerIndex(response.ledger_index)
	const timestampMs = (
		transactionJson.date != null ?
			(transactionJson.date + XRPL_RIPPLE_EPOCH_OFFSET_SECONDS) * 1_000
		:
			undefined
	)
	if (timestampMs != null && !Number.isSafeInteger(timestampMs))
		throw new Error('XrplClio_JsonRpc: transaction has a malformed close time')

	const transactionSelector = {
		$network: network,
		hash: response.hash,
	}

	return {
		transactionType: transactionJson.TransactionType,
		account: transactionJson.Account,
		...(transactionJson.Sequence != null && {
			sequence: transactionJson.Sequence,
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transaction: transactionSelector,
				ledgerIndex,
				source: Source.XrplClio_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				...(timestampMs != null && {
					[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')]: timestampMs,
				}),
				...(transactionJson.Fee != null && {
					[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')]: BigInt(transactionJson.Fee),
				}),
				...(response.meta?.TransactionResult != null && {
					[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')]: response.meta.TransactionResult,
					[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')]: response.meta.TransactionResult,
				}),
				[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'validated')]: true,
				...(response.meta != null && {
					[entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')]: response.meta,
				}),
			},
		}],
	}
}

const continuationMarker = (
	token: string | undefined
): XrplClioMarker | undefined => {
	if (token == null || token.length === 0)
		return undefined
	try {
		return JSON.parse(token) as XrplClioMarker
	} catch {
		throw new Error('XrplClio_JsonRpc: malformed ledger data continuation')
	}
}

const ledgerDataContinuation = (
	ledgerIndex: bigint,
	marker: XrplClioMarker | undefined,
	currentToken: string | undefined
): ProviderContinuation => {
	if (marker == null) {
		if (currentToken == null)
			return {
				operation: 'ledger-data',
				target: String(ledgerIndex),
				terminal: true,
			}
		throw new Error('XrplClio_JsonRpc: ledger data continuation did not advance')
	}

	return {
		operation: 'ledger-data',
		target: String(ledgerIndex),
		token: JSON.stringify(marker),
	}
}

const validatedLedgerDataPage = async (
	ledgerIndex: bigint,
	limit: number,
	marker: XrplClioMarker | undefined
) => {
	if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('XrplClio_JsonRpc: ledger index is too large')

	const { getLedgerData } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
	const ledgerData = await getLedgerData(
		limit,
		Number(ledgerIndex),
		marker
	) as XrplClioLedgerDataResult
	if (ledgerData.ledger_index !== Number(ledgerIndex))
		throw new Error('XrplClio_JsonRpc: ledger data index does not match')

	return {
		ledgerData,
		ledgerIndex: validatedLedgerIndex(ledgerData.ledger_index),
	}
}

export default {
	source: Source.XrplClio_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.XrplLedger,
			resolve: {
				NetworkLedgerIndex: {
					resolve: async ({ $network, ledgerIndex }) => (
						resolveXrplLedger($network, {
							ledgerIndex,
						})
					),
				},
				NetworkLedgerHash: {
					resolve: async ({ $network, ledgerHash }) => (
						resolveXrplLedger($network, {
							ledgerHash,
						})
					),
				},
			},
		})({
			ledgerHash: (ledger) => ledger.ledgerHash,
			ledgerIndex: (ledger) => ledger.ledgerIndex,
			validated: (ledger) => ledger.validated,
			closeTimeMs: (ledger) => ledger.closeTimeMs,
			totalCoinsDrops: (ledger) => ledger.totalCoinsDrops,
			parentHash: (ledger) => ledger.parentHash,
			accountHash: (ledger) => ledger.accountHash,
			transactionHash: (ledger) => ledger.transactionHash,
		}),

		defineResolver({
			entityType: EntityType.XrplLedger,
			resolve: {
				NetworkLedgerIndex: {
					resolve: async ({ $network, ledgerIndex }, context) => {
						assertXrplMainnet($network)
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('XrplClio_JsonRpc: ledger index is too large')
						const { getLedgerTransactions } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						const ledger = await getLedgerTransactions(Number(ledgerIndex))
						assertValidatedLedger(ledger)
						if (BigInt(ledger.ledger_index) !== ledgerIndex)
							throw new Error('XrplClio_JsonRpc: ledger index does not match')
						return (ledger.transactions ?? [])
							.slice(0, limit)
							.map((transaction) => projectLedgerTransaction($network, ledgerIndex, transaction))
					},
				},
			},
		})({
			$$transactions: (transactions) => transactions,
		}),

		defineResolver({
			entityType: EntityType.XrplLedger,
			resolve: {
				NetworkLedgerIndex: {
					resolve: async ({ $network, ledgerIndex }, context) => {
						assertXrplMainnet($network)
						const limit = resolverContextRowLimit(context)
						const { ledgerData } = await validatedLedgerDataPage(
							ledgerIndex,
							limit,
							continuationMarker(context.providerContinuationToken)
						)
						return {
							entries: ledgerData.state
								.slice(0, limit)
								.map((entry) => ({
									[EntityMetaKey.Selector]: {
										$ledger: {
											$network,
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
											[entityFieldAddressKey(EntityType.XrplLedgerEntry, [], 'previousTransactionLedgerIndex')]: validatedLedgerIndex(entry.PreviousTxnLgrSeq),
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
			$$ledgerEntries: {
				select: (page) => page.entries,
				continuation: (page, _ledger, context) => ledgerDataContinuation(
					page.ledgerIndex,
					page.marker,
					context.providerContinuationToken
				),
			},
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
						const { getTransaction } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
						const response = await getTransaction(transaction.hash)
						if (response.hash !== transaction.hash)
							throw new Error('XrplClio_JsonRpc: transaction response does not match the subject')
						return projectTransaction(transaction.$network, response)
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
			entityType: EntityType.XrplTransaction_Timestamp,
			resolve: {
				TransactionLedgerIndexSource: {
					resolve: async ({ $transaction, ledgerIndex, source }) => {
						assertXrplMainnet($transaction.$network)
						if (source !== Source.XrplClio_JsonRpc)
							throw new Error('XrplClio_JsonRpc: transaction observation source does not match')
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('XrplClio_JsonRpc: ledger index is too large')

						const { getTransaction } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
						const response = await getTransaction($transaction.hash)
						if (response.hash !== $transaction.hash)
							throw new Error('XrplClio_JsonRpc: transaction response does not match the subject')
						if (response.ledger_index == null)
							throw new Error('XrplClio_JsonRpc: transaction is missing its ledger index')
						if (validatedLedgerIndex(response.ledger_index) !== ledgerIndex)
							throw new Error('XrplClio_JsonRpc: transaction observation ledger index does not match')

						const projected = projectTransaction($transaction.$network, response)
						const observation = projected.$$timestamps[0]
						return {
							...(observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')] != null && {
								timestampMs: observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'timestampMs')],
							}),
							...(observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')] != null && {
								fee: observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'fee')],
							}),
							...(observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')] != null && {
								status: observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'status')],
								resultCode: observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'resultCode')],
							}),
							validated: true,
							...(observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')] != null && {
								meta: observation[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.XrplTransaction_Timestamp, [], 'meta')],
							}),
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			fee: (observation) => observation.fee,
			status: (observation) => observation.status,
			resultCode: (observation) => observation.resultCode,
			validated: (observation) => observation.validated,
			meta: (observation) => observation.meta,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						assertXrplMainnet(network)
						const { getRecentLedgers } = await import('$/sources/XrplClio/JsonRpc/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (await getRecentLedgers(limit))
							.map((ledger) => projectLedgerRow(network, ledger))
					},
				},
			},
			resolveLive: {
				ledgerStream: {
					facetPath: [
						'Xrpl',
					],
					publishes: {
						'$$ledgers': true,
					},
					start: async ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertXrplMainnet(parentEntitySelector)

						const { streamLedger } = await import('$/sources/XrplClio/JsonRpc/queries.ts')

						for await (const message of streamLedger(signal)) {
							if (signal.aborted)
								return
							if (
								!isJsonNumber(message.ledger_index)
								|| !Number.isSafeInteger(message.ledger_index)
								|| message.ledger_index < 0
							)
								throw new Error('XrplClio_JsonRpc: malformed ledgerClosed ledger_index')
							if (!isJsonString(message.ledger_hash) || message.ledger_hash.length === 0)
								throw new Error('XrplClio_JsonRpc: malformed ledgerClosed ledger_hash')

							fields.$$ledgers.replaceRows([{
								source: Source.XrplClio_JsonRpc,
								value: [{
									[EntityMetaKey.Selector]: {
										$network: parentEntitySelector,
										ledgerIndex: BigInt(message.ledger_index),
									},
								}],
							}])
						}
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
					resolve: async (network) => {
						assertXrplMainnet(network)
						const {
							countCompleteLedgers,
							getServerInfo,
							getValidatedLedger,
						} = await import('$/sources/XrplClio/JsonRpc/queries.ts')
						const [
							serverInfo,
							tip,
						] = await Promise.all([
							getServerInfo(),
							getValidatedLedger(),
						])
						assertValidatedLedger(tip)
						return (
							countCompleteLedgers(serverInfo.info.complete_ledgers)
							?? tip.ledger_index + 1
						)
					},
				},
			},
		})({
			Xrpl: {
				$$ledgers: {
					resolveCount: (count) => count,
				},
			},
		}),
	],
}
