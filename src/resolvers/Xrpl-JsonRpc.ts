import {
	type ProviderContinuation,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { Source } from '$/sources/Source.ts'
import {
	XRPL_RIPPLE_EPOCH_OFFSET_SECONDS,
	type XrplAccountInfoResult,
	type XrplAccountLine,
	type XrplLedgerResult,
	type XrplMarker,
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

const xrplTrustlineSnapshot = (
	trustline: EntitySelector<typeof schema, EntityType.XrplTrustline>,
	ledgerIndex: bigint,
	line: XrplAccountLine
) => {
	if (line.account !== trustline.issuer || line.currency !== trustline.currency)
		throw new Error('Xrpl_Rippled: trustline response does not match the subject')
	if (
		![line.balance, line.limit, line.limit_peer].every((value) => (
			/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
		))
	)
		throw new Error('Xrpl_Rippled: account trustline has a malformed amount')

	return {
		$trustline: {
			[EntityMetaKey.Selector]: trustline,
		},
		ledgerIndex,
		source: Source.Xrpl_Rippled,
		balance: line.balance,
		limit: line.limit,
		limitPeer: line.limit_peer,
		noRipple: line.no_ripple ?? false,
		noRipplePeer: line.no_ripple_peer ?? false,
		authorized: line.authorized ?? false,
		peerAuthorized: line.peer_authorized ?? false,
	}
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

const getXrplLedger = async (
	specifier: 'validated' | number | {
		ledgerHash: string
	}
) => {
	const { getLedger } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
	const ledger = await getLedger(specifier)
	if (!ledger.validated)
		throw new Error('Xrpl_Rippled: ledger is not validated')
	if (!Number.isSafeInteger(ledger.ledger_index) || ledger.ledger_index < 0)
		throw new Error('Xrpl_Rippled: malformed validated ledger index')
	if (ledger.ledger_hash.length === 0)
		throw new Error('Xrpl_Rippled: malformed validated ledger hash')

	return ledger
}

const getXrplValidatedLedger = async () => (
	getXrplLedger('validated')
)

const ledgerCloseTimeMs = (
	ledgerBody: NonNullable<XrplLedgerResult['ledger']> | undefined
) => {
	if (ledgerBody?.close_time == null)
		return undefined
	if (!Number.isSafeInteger(ledgerBody.close_time) || ledgerBody.close_time < 0)
		throw new Error('Xrpl_Rippled: malformed ledger close time')

	const timestampMs = (
		ledgerBody.close_time
		+ XRPL_RIPPLE_EPOCH_OFFSET_SECONDS
	) * 1_000
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('Xrpl_Rippled: malformed ledger close time')

	if (ledgerBody.close_time_human != null) {
		const parsed = Date.parse(ledgerBody.close_time_human)
		if (Number.isSafeInteger(parsed) && parsed !== timestampMs)
			throw new Error('Xrpl_Rippled: ledger close time does not match close_time_human')
	}

	return timestampMs
}

const ledgerTotalCoinsDrops = (
	totalCoins: NonNullable<XrplLedgerResult['ledger']>['total_coins'] | undefined
) => {
	if (totalCoins == null)
		return undefined
	if (!/^(?:0|[1-9]\d*)$/.test(totalCoins))
		throw new Error('Xrpl_Rippled: malformed total coins')
	return BigInt(totalCoins)
}

const xrplLedgerFields = (
	ledger: Awaited<ReturnType<typeof getXrplLedger>>
) => {
	const body = ledger.ledger
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

const getXrplValidatedLedgerHead = async (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	assertXrplNetwork(network)
	const fields = xrplLedgerFields(await getXrplValidatedLedger())

	return [{
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
	}]
}

const resolveXrplLedger = async (
	network: EntitySelector<typeof schema, EntityType.Network>,
	match: {
		ledgerIndex?: bigint
		ledgerHash?: string
	}
) => {
	assertXrplNetwork(network)
	if (match.ledgerIndex != null && match.ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Xrpl_Rippled: ledger index is too large')

	const fields = xrplLedgerFields(
		await getXrplLedger(
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
		throw new Error('Xrpl_Rippled: validated ledger index does not match')
	if (match.ledgerHash != null && fields.ledgerHash !== match.ledgerHash)
		throw new Error('Xrpl_Rippled: validated ledger hash does not match')

	return fields
}

export default {
	source: Source.Xrpl_Rippled,

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
			entityType: EntityType.XrplLedgerEntry,
			resolve: {
				LedgerEntryHash: {
					resolve: async ({ $ledger, entryHash }) => {
						assertXrplNetwork($ledger.$network)
						if (
							'ledgerIndex' in $ledger
							&& $ledger.ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER)
						)
							throw new Error('Xrpl_Rippled: ledger entry ledger index is too large')
						const { getLedgerEntry } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const response = await getLedgerEntry(entryHash, (
							'ledgerIndex' in $ledger ?
								Number($ledger.ledgerIndex)
							: 'ledgerHash' in $ledger ?
								{
									ledgerHash: $ledger.ledgerHash,
								}
							:
								'validated'
						))
						if (
							'ledgerIndex' in $ledger
							&& response.ledger_index == null
						)
							throw new Error('Xrpl_Rippled: ledger entry is missing its ledger index')
						if (
							'ledgerIndex' in $ledger
							&& response.ledger_index != null
							&& validatedLedgerIndex(response.ledger_index) !== $ledger.ledgerIndex
						)
							throw new Error('Xrpl_Rippled: ledger entry ledger index does not match')
						if (
							'ledgerHash' in $ledger
							&& response.ledger_hash == null
						)
							throw new Error('Xrpl_Rippled: ledger entry is missing its ledger hash')
						if (
							'ledgerHash' in $ledger
							&& response.ledger_hash != null
							&& response.ledger_hash.toLowerCase() !== $ledger.ledgerHash.toLowerCase()
						)
							throw new Error('Xrpl_Rippled: ledger entry ledger hash does not match')

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
			entityType: EntityType.XrplTrustline,
			resolve: {
				NetworkAccountCurrencyIssuer: {
					resolve: async (trustline) => {
						assertXrplNetwork(trustline.$network)
						const { getAccountLines } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const response = await getAccountLines(
							trustline.account,
							400,
							undefined,
							trustline.issuer
						)
						if (!response.validated || response.ledger_index == null)
							throw new Error('Xrpl_Rippled: direct trustline is not validated')
						const line = response.lines.find(({ account, currency }) => (
							account === trustline.issuer && currency === trustline.currency
						))
						if (line == null)
							throw new Error('Xrpl_Rippled: trustline not found')

						const snapshot = xrplTrustlineSnapshot(
							trustline,
							validatedLedgerIndex(response.ledger_index),
							line
						)
						return {
							$account: {
								[EntityMetaKey.Selector]: {
									$network: trustline.$network,
									account: trustline.account,
								},
							},
							$issuerAccount: {
								[EntityMetaKey.Selector]: {
									$network: trustline.$network,
									account: trustline.issuer,
								},
							},
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$trustline: trustline,
									ledgerIndex: snapshot.ledgerIndex,
									source: Source.Xrpl_Rippled,
								},
							}],
						}
					},
				},
			},
		})({
			$account: (trustline) => trustline.$account,
			$issuerAccount: (trustline) => trustline.$issuerAccount,
			$$timestamps: (trustline) => trustline.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplTrustline_Timestamp,
			resolve: {
				TrustlineLedgerIndexSource: {
					resolve: async ({ $trustline, ledgerIndex, source }) => {
						assertXrplNetwork($trustline.$network)
						if (source !== Source.Xrpl_Rippled)
							throw new Error('Xrpl_Rippled: trustline observation source does not match')
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Xrpl_Rippled: trustline observation ledger index is too large')

						const { getAccountLines } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const response = await getAccountLines(
							$trustline.account,
							400,
							undefined,
							$trustline.issuer,
							Number(ledgerIndex)
						)
						if (!response.validated || response.ledger_index == null)
							throw new Error('Xrpl_Rippled: trustline observation is not validated')
						if (validatedLedgerIndex(response.ledger_index) !== ledgerIndex)
							throw new Error('Xrpl_Rippled: trustline observation ledger index does not match')
						const line = response.lines.find(({ account, currency }) => (
							account === $trustline.issuer && currency === $trustline.currency
						))
						if (line == null)
							throw new Error('Xrpl_Rippled: trustline not found at ledger')

						return xrplTrustlineSnapshot($trustline, ledgerIndex, line)
					},
				},
			},
		})({
			$trustline: (timestamp) => timestamp.$trustline,
			ledgerIndex: (timestamp) => timestamp.ledgerIndex,
			source: (timestamp) => timestamp.source,
			balance: (timestamp) => timestamp.balance,
			limit: (timestamp) => timestamp.limit,
			limitPeer: (timestamp) => timestamp.limitPeer,
			noRipple: (timestamp) => timestamp.noRipple,
			noRipplePeer: (timestamp) => timestamp.noRipplePeer,
			authorized: (timestamp) => timestamp.authorized,
			peerAuthorized: (timestamp) => timestamp.peerAuthorized,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: getXrplValidatedLedgerHead,
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

		defineResolver({
			entityType: EntityType.XrplAmendment,
			resolve: {
				NetworkAmendmentId: {
					resolve: async (amendment) => {
						assertXrplNetwork(amendment.$network)
						const {
							getFeatures,
							getValidatedLedger,
						} = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const [
							features,
							ledger,
						] = await Promise.all([
							getFeatures(),
							getValidatedLedger(),
						])
						const featuresById: Partial<typeof features> = features
						const feature = featuresById[amendment.amendmentId]
						if (feature == null)
							throw new Error('Xrpl_Rippled: amendment is not advertised by this rippled')
						if (!ledger.validated)
							throw new Error('Xrpl_Rippled: ledger is not validated')
						const ledgerIndex = validatedLedgerIndex(ledger.ledger_index)
						return {
							...(feature.name != null && {
								name: feature.name,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$amendment: amendment,
									ledgerIndex,
									source: Source.Xrpl_Rippled,
								},
								[EntityMetaKey.Fields]: {
									...(feature.enabled != null && {
										[entityFieldAddressKey(EntityType.XrplAmendment_Timestamp, [], 'enabled')]: feature.enabled,
									}),
									...(feature.supported != null && {
										[entityFieldAddressKey(EntityType.XrplAmendment_Timestamp, [], 'supported')]: feature.supported,
									}),
									[entityFieldAddressKey(EntityType.XrplAmendment_Timestamp, [], 'status')]: (
										feature.enabled === true ?
											'enabled'
										: feature.supported === true ?
											'supported'
										: feature.vetoed === true ?
											'vetoed'
										:
											'unknown'
									),
								},
							}],
						}
					},
				},
			},
		})({
			name: (snapshot) => snapshot.name,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XrplAmendment_Timestamp,
			resolve: {
				AmendmentLedgerIndexSource: {
					resolve: async ({ $amendment, ledgerIndex, source }) => {
						assertXrplNetwork($amendment.$network)
						if (source !== Source.Xrpl_Rippled)
							throw new Error('Xrpl_Rippled: amendment observation source does not match')
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Xrpl_Rippled: amendment observation ledger index is too large')

						const {
							getFeatures,
							getValidatedLedger,
						} = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const [
							features,
							ledger,
						] = await Promise.all([
							getFeatures(),
							getValidatedLedger(),
						])
						const featuresById: Partial<typeof features> = features
						const feature = featuresById[$amendment.amendmentId]
						if (feature == null)
							throw new Error('Xrpl_Rippled: amendment is not advertised by this rippled')
						if (!ledger.validated)
							throw new Error('Xrpl_Rippled: ledger is not validated')
						const tipLedgerIndex = validatedLedgerIndex(ledger.ledger_index)
						if (tipLedgerIndex !== ledgerIndex)
							throw new Error('Xrpl_Rippled: amendment observation ledger index does not match tip')

						return {
							...(feature.enabled != null && {
								enabled: feature.enabled,
							}),
							...(feature.supported != null && {
								supported: feature.supported,
							}),
							status: (
								feature.enabled === true ?
									'enabled'
								: feature.supported === true ?
									'supported'
								: feature.vetoed === true ?
									'vetoed'
								:
									'unknown'
							),
						}
					},
				},
			},
		})({
			enabled: (observation) => observation.enabled,
			supported: (observation) => observation.supported,
			status: (observation) => observation.status,
		}),

		defineResolver({
			entityType: EntityType.XrplAmm,
			resolve: {
				NetworkAmmAccount: {
					resolve: async (amm) => {
						assertXrplNetwork(amm.$network)
						const { getAmmInfo } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const ammInfo = await getAmmInfo(amm.ammAccount)
						if (!ammInfo.validated)
							throw new Error('Xrpl_Rippled: AMM info is not validated')
						if (ammInfo.amm.account !== amm.ammAccount)
							throw new Error('Xrpl_Rippled: AMM response does not match the subject')
						const tipLedgerIndex = ammInfo.ledger_index ?? ammInfo.ledger_current_index
						if (tipLedgerIndex == null)
							throw new Error('Xrpl_Rippled: AMM response is missing its validated ledger index')
						const ledgerIndex = validatedLedgerIndex(tipLedgerIndex)
						const { amount, amount2, lp_token, trading_fee, auction_slot, vote_slots } = ammInfo.amm
						return {
							assetCurrency: typeof amount === 'string' ? 'XRP' : amount.currency,
							...(typeof amount !== 'string' && amount.issuer != null && {
								assetIssuer: amount.issuer,
							}),
							asset2Currency: typeof amount2 === 'string' ? 'XRP' : amount2.currency,
							...(typeof amount2 !== 'string' && amount2.issuer != null && {
								asset2Issuer: amount2.issuer,
							}),
							...(lp_token.currency.length > 0 && {
								lpTokenCurrency: lp_token.currency,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$amm: amm,
									ledgerIndex,
									source: Source.Xrpl_Rippled,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'assetAmount')]: (
										typeof amount === 'string' ?
											amount
										:
											amount.value ?? ''
									),
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'asset2Amount')]: (
										typeof amount2 === 'string' ?
											amount2
										:
											amount2.value ?? ''
									),
									...(lp_token.value != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'lpTokenBalance')]: lp_token.value,
									}),
									[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'tradingFee')]: trading_fee,
									...(auction_slot != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'auctionSlot')]: auction_slot,
									}),
									...(vote_slots != null && {
										[entityFieldAddressKey(EntityType.XrplAmm_Timestamp, [], 'voteSlots')]: vote_slots,
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
					resolve: async ({ $amm, ledgerIndex, source }) => {
						assertXrplNetwork($amm.$network)
						if (source !== Source.Xrpl_Rippled)
							throw new Error('Xrpl_Rippled: AMM observation source does not match')
						if (ledgerIndex > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Xrpl_Rippled: AMM observation ledger index is too large')

						const { getAmmInfo } = await import('$/sources/Xrpl/JsonRpc/queries.ts')
						const ammInfo = await getAmmInfo(
							$amm.ammAccount,
							Number(ledgerIndex)
						)
						if (!ammInfo.validated)
							throw new Error('Xrpl_Rippled: AMM info is not validated')
						if (ammInfo.amm.account !== $amm.ammAccount)
							throw new Error('Xrpl_Rippled: AMM response does not match the subject')
						const tipLedgerIndex = ammInfo.ledger_index ?? ammInfo.ledger_current_index
						if (tipLedgerIndex == null)
							throw new Error('Xrpl_Rippled: AMM response is missing its validated ledger index')
						const observationLedgerIndex = validatedLedgerIndex(tipLedgerIndex)
						if (observationLedgerIndex !== ledgerIndex)
							throw new Error('Xrpl_Rippled: AMM observation ledger index does not match')

						const { amount, amount2, lp_token, trading_fee, auction_slot, vote_slots } = ammInfo.amm
						return {
							assetAmount: typeof amount === 'string' ? amount : amount.value ?? '',
							asset2Amount: typeof amount2 === 'string' ? amount2 : amount2.value ?? '',
							...(lp_token.value != null && {
								lpTokenBalance: lp_token.value,
							}),
							tradingFee: trading_fee,
							...(auction_slot != null && {
								auctionSlot: auction_slot,
							}),
							...(vote_slots != null && {
								voteSlots: vote_slots,
							}),
						}
					},
				},
			},
		})({
			assetAmount: (observation) => observation.assetAmount,
			asset2Amount: (observation) => observation.asset2Amount,
			lpTokenBalance: (observation) => observation.lpTokenBalance,
			tradingFee: (observation) => observation.tradingFee,
			auctionSlot: (observation) => observation.auctionSlot,
			voteSlots: (observation) => observation.voteSlots,
		}),
	],
}
