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
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	AlgodPendingTransaction,
	AlgodParticipationKey,
	AlgodSignedTransaction,
} from '$/sources/Algod/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type AlgorandNetworkSelector = EntitySelector<typeof schema, EntityType.AlgorandNetwork>

const algorandBoxApplicability = [{
	$application: {
		$network: {
			$network: {
				slug: networkBySlug.algorand.slug,
			},
		},
	},
}] as const

const assertAlgorandMainnet = (
	network: AlgorandNetworkSelector
) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug.algorand.slug
	)
		return

	throw new Error('Algod_Rest: unsupported network')
}

const optionalSafeBigInt = (
	value: number | undefined
) => (
	value == null || !Number.isSafeInteger(value) || value < 0 ?
		undefined
	:
		BigInt(value)
)

const nodelyAlgodNodeId = 'nodely-algod'

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

const zeroExHexToBase64 = (
	value: `0x${string}`
) => {
	if (value.length % 2 !== 0)
		throw new Error('Algod_Rest: application box name must contain whole bytes')

	const bytes = value.slice(2).match(/.{2}/g) ?? []
	return globalThis.btoa(String.fromCharCode(...bytes.map((byte) => Number.parseInt(byte, 16))))
}

const base64Sha256 = async (
	value: string
) => {
	const bytes = Uint8Array.from(
		globalThis.atob(value),
		(character) => character.charCodeAt(0)
	)
	return `0x${[...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes))]
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')}` as const
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

const participationKeyFields = (
	participationKey: AlgodParticipationKey
) => ({
	nodeId: nodelyAlgodNodeId,
	participationId: participationKey.id,
	$account: {
		[EntityMetaKey.Selector]: {
			$network: {
				$network: {
					slug: networkBySlug.algorand.slug,
				},
			},
			address: participationKey.address,
		},
	},
	$network: {
		[EntityMetaKey.Selector]: {
			$network: {
				slug: networkBySlug.algorand.slug,
			},
		},
	},
	firstValidRound: BigInt(participationKey.key['vote-first-valid']),
	lastValidRound: BigInt(participationKey.key['vote-last-valid']),
	keyDilution: BigInt(participationKey.key['vote-key-dilution']),
	selectionKey: participationKey.key['selection-participation-key'],
	votingKey: participationKey.key['vote-participation-key'],
	...(participationKey.key['state-proof-key'] != null && {
		stateProofKey: participationKey.key['state-proof-key'],
	}),
	...(participationKey['effective-first-valid'] != null && {
		effectiveFirstRound: BigInt(participationKey['effective-first-valid']),
	}),
	...(participationKey['effective-last-valid'] != null && {
		effectiveLastRound: BigInt(participationKey['effective-last-valid']),
	}),
})

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
			entityType: EntityType.AlgorandBox,
			resolve: {
				ApplicationBoxName: {
					appliesTo: algorandBoxApplicability,
					resolve: async (box) => {
						assertAlgorandMainnet(box.$application.$network)
						const { getApplicationBox } = await import('$/sources/Algod/Rest/queries.ts')
						const response = await getApplicationBox({
							applicationId: box.$application.applicationId,
							boxName: zeroExHexToBase64(box.boxName),
						})
						return [{
							[EntityMetaKey.Selector]: {
								$box: box,
								round: response.round,
								source: Source.Nodely,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.AlgorandBox_Round, [], 'valueHash')]: await base64Sha256(response.body.value),
								[entityFieldAddressKey(EntityType.AlgorandBox_Round, [], 'deleted')]: false,
							},
						}]
					},
				},
			},
		})({
			$$rounds: (rounds) => rounds,
		}),

		defineResolver({
			entityType: EntityType.AlgorandBox_Round,
			resolve: {
				BoxRoundSource: {
					appliesTo: [{
						$box: algorandBoxApplicability[0],
						source: Source.Nodely,
					}],
					resolve: async ({
						$box,
						round,
						source,
					}) => {
						assertAlgorandMainnet($box.$application.$network)
						if (source !== Source.Nodely)
							throw new Error(`Algod_Rest: unsupported source ${source}`)
						const { getApplicationBox } = await import('$/sources/Algod/Rest/queries.ts')
						const response = await getApplicationBox({
							applicationId: $box.$application.applicationId,
							boxName: zeroExHexToBase64($box.boxName),
						})
						if (response.round !== round)
							throw new Error('Algod_Rest: application box round mismatch')
						return {
							valueHash: await base64Sha256(response.body.value),
							deleted: false,
						}
					},
				},
			},
		})({
			valueHash: (box) => box.valueHash,
			deleted: (box) => box.deleted,
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getParticipationKeys } = await import('$/sources/Algod/Rest/queries.ts')
						return (await getParticipationKeys()).map((participationKey) => ({
							[EntityMetaKey.Selector]: {
								nodeId: nodelyAlgodNodeId,
								participationId: participationKey.id,
							},
						}))
					},
				},
			},
		})({
			$$blockheadAlgorandParticipationKeys: (participationKeys) => participationKeys,
		}),

		defineResolver({
			entityType: EntityType.BlockheadAlgorandParticipationKey,
			resolve: {
				NodeIdParticipationId: {
					resolve: async ({
						nodeId,
						participationId,
					}) => {
						if (nodeId !== nodelyAlgodNodeId)
							throw new Error(`Algod_Rest: unsupported node ${nodeId}`)

						const { getParticipationKey } = await import('$/sources/Algod/Rest/queries.ts')
						return participationKeyFields(await getParticipationKey(participationId))
					},
				},
			},
		})({
			nodeId: (participationKey) => participationKey.nodeId,
			participationId: (participationKey) => participationKey.participationId,
			$account: (participationKey) => participationKey.$account,
			$network: (participationKey) => participationKey.$network,
			firstValidRound: (participationKey) => participationKey.firstValidRound,
			lastValidRound: (participationKey) => participationKey.lastValidRound,
			keyDilution: (participationKey) => participationKey.keyDilution,
			selectionKey: (participationKey) => participationKey.selectionKey,
			votingKey: (participationKey) => participationKey.votingKey,
			stateProofKey: (participationKey) => participationKey.stateProofKey,
			effectiveFirstRound: (participationKey) => participationKey.effectiveFirstRound,
			effectiveLastRound: (participationKey) => participationKey.effectiveLastRound,
		}),

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
