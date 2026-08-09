/**
 * Nodely Algod REST — connected-node pool surface.
 *
 * Projects enrolled `BlockheadAlgorandPendingTransaction` from
 * `/v2/transactions/pending/{txid}` (singular-by-txid). Pool-wide
 * `/v2/transactions/pending` only contributes honest `poolPriority` when the
 * pending signed txn is found in the priority-ordered page; it does not invent
 * txIds for list rows (signed-txn wires lack txId).
 */
import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	AlgodPendingTransaction,
	AlgodSignedTransaction,
} from '$/sources/Algod/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const optionalSafeBigInt = (
	value: number | undefined
) => (
	value == null || !Number.isSafeInteger(value) || value < 0 ?
		undefined
	:
		BigInt(value)
)

const base64ToZeroExHex = (
	value: string,
	label: string
) => {
	try {
		const bytes = Uint8Array.from(
			globalThis.atob(value),
			(character) => character.charCodeAt(0)
		)
		return `0x${[...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')}` as const
	} catch {
		throw new Error(`Algod_Rest: malformed ${label}`)
	}
}

const signedTransactionsEqual = (
	left: AlgodSignedTransaction,
	right: AlgodSignedTransaction
) => (
	JSON.stringify(left) === JSON.stringify(right)
)

const pendingTransactionFields = (
	{
		nodeId,
		txId,
		observedAtMs,
		pending,
		poolPriority,
	}: {
		nodeId: string
		txId: string
		observedAtMs: number
		pending: AlgodPendingTransaction
		poolPriority?: number
	}
) => {
	const signed = pending.txn
	const txn = signed.txn
	return {
		nodeId,
		txId,
		observedAtMs,
		$network: {
			[EntityMetaKey.Selector]: {
				$network: {
					slug: networkBySlug.algorand.slug,
				},
			},
		},
		sender: txn.snd,
		transactionType: txn.type,
		fee: optionalSafeBigInt(txn.fee),
		firstValidRound: optionalSafeBigInt(txn.fv),
		lastValidRound: optionalSafeBigInt(txn.lv),
		...(
			txn.grp != null && txn.grp.length > 0 && {
				group: base64ToZeroExHex(txn.grp, 'pending transaction group'),
			}
		),
		...(poolPriority != null && { poolPriority }),
		payload: pending,
	}
}

const poolPriorityForSignedTransaction = async (
	signed: AlgodSignedTransaction
) => {
	const { getPendingTransactions } = await import('$/sources/Algod/Rest/queries.ts')
	const page = await getPendingTransactions(0)
	const index = page['top-transactions'].findIndex((candidate) => (
		signedTransactionsEqual(candidate, signed)
	))
	return (
		index >= 0 ?
			index
		:
			undefined
	)
}

export default {
	source: Source.Nodely,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadAlgorandPendingTransaction,
			resolve: {
				NodeIdTxIdObservedAtMs: {
					resolve: async ({
						nodeId,
						txId,
						observedAtMs,
					}) => {
						const { getPendingTransaction } = await import('$/sources/Algod/Rest/queries.ts')
						const pending = await getPendingTransaction(txId)
						let poolPriority: number | undefined
						try {
							poolPriority = await poolPriorityForSignedTransaction(pending.txn)
						} catch {
							poolPriority = undefined
						}
						return pendingTransactionFields({
							nodeId,
							txId,
							observedAtMs,
							pending,
							...(poolPriority != null && { poolPriority }),
						})
					},
				},
			},
		})({
			$network: (pendingTransaction) => pendingTransaction.$network,
			sender: (pendingTransaction) => pendingTransaction.sender,
			transactionType: (pendingTransaction) => pendingTransaction.transactionType,
			fee: (pendingTransaction) => pendingTransaction.fee,
			firstValidRound: (pendingTransaction) => pendingTransaction.firstValidRound,
			lastValidRound: (pendingTransaction) => pendingTransaction.lastValidRound,
			group: (pendingTransaction) => pendingTransaction.group,
			poolPriority: (pendingTransaction) => pendingTransaction.poolPriority,
			payload: (pendingTransaction) => pendingTransaction.payload,
		}),
	],
} as const satisfies RegisteredSourceResolverModule
