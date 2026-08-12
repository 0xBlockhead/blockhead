import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getJson,
	httpUrl,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Nodely/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import type {
	AlgodApplicationBox,
	AlgodBlockHash,
	AlgodNodeStatus,
	AlgodParticipationKey,
	AlgodPendingTransaction,
	AlgodPendingTransactions,
	AlgodSignedTransaction,
	AlgodTransactionParams,
	AlgodTransactionProof,
} from '$/sources/Algod/Rest/types.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.Nodely].find(({ apiFamily }) => (
	apiFamily === ApiFamily.AlgodRestApi
))

if (binding == null)
	throw new Error('Algod_Rest: binding is missing')

const unsigned = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const addressWire = arktype('/^[A-Z2-7]{57}[AEIMQUY4]$/')
const nonEmptyString = arktype('string > 0')
const txIdWire = arktype('/^[A-Z0-9]+$/')
const nonEmptyBase64ish = arktype('string > 0')

const statusWire = arktype({
	'last-round': unsigned,
	'last-version': nonEmptyString,
	'next-version': nonEmptyString,
	'next-version-round': unsigned,
	'next-version-supported': 'boolean',
	'stopped-at-unsupported-round': 'boolean',
	'catchup-time': unsigned,
	'time-since-last-round': unsigned,
	'catchpoint?': 'string',
	'last-catchpoint?': 'string',
	'catchpoint-acquired-blocks?': unsigned,
	'catchpoint-processed-accounts?': unsigned,
	'catchpoint-processed-kvs?': unsigned,
	'catchpoint-total-accounts?': unsigned,
	'catchpoint-total-blocks?': unsigned,
	'catchpoint-total-kvs?': unsigned,
	'catchpoint-verified-accounts?': unsigned,
	'catchpoint-verified-kvs?': unsigned,
	'upgrade-delay?': unsigned,
	'upgrade-next-protocol-vote-before?': unsigned,
	'upgrade-no-votes?': unsigned,
	'upgrade-node-vote?': 'boolean',
	'upgrade-vote-rounds?': unsigned,
	'upgrade-votes?': unsigned,
	'upgrade-votes-required?': unsigned,
	'upgrade-yes-votes?': unsigned,
})

const signedTransactionWire = arktype({
	'sig?': 'string',
	'msig?': 'unknown',
	'lsig?': 'unknown',
	'sgnr?': addressWire,
	txn: {
		snd: addressWire,
		type: nonEmptyString,
		'fee?': unsigned,
		'fv?': unsigned,
		'lv?': unsigned,
		'gen?': 'string',
		'gh?': 'string',
		'note?': 'string',
		'grp?': 'string',
		'lx?': 'string',
		'rekey?': addressWire,
	},
})

const pendingTransactionsWire = arktype({
	'top-transactions': signedTransactionWire.array(),
	'total-transactions': unsigned,
})

const pendingTransactionWire: arktype.Any = arktype({
	txn: signedTransactionWire,
	'pool-error': 'string',
	'confirmed-round?': unsigned,
	'application-index?': unsigned,
	'asset-index?': unsigned,
	'closing-amount?': unsigned,
	'asset-closing-amount?': unsigned,
	'sender-rewards?': unsigned,
	'receiver-rewards?': unsigned,
	'close-rewards?': unsigned,
	'logs?': 'string[]',
	'inner-txns?': arktype('unknown[]'),
	'global-state-delta?': 'unknown',
	'local-state-delta?': 'unknown',
})

const participationKeyWire = arktype({
	address: addressWire,
	id: nonEmptyString,
	key: {
		'selection-participation-key': nonEmptyBase64ish,
		'vote-participation-key': nonEmptyBase64ish,
		'vote-first-valid': unsigned,
		'vote-last-valid': unsigned,
		'vote-key-dilution': unsigned,
		'state-proof-key?': nonEmptyBase64ish,
	},
	'effective-first-valid?': unsigned,
	'effective-last-valid?': unsigned,
	'last-block-proposal?': unsigned,
	'last-state-proof?': unsigned,
	'last-vote?': unsigned,
})

const participationKeysWire = participationKeyWire.array()

const transactionParamsWire = arktype({
	'consensus-version': nonEmptyString,
	fee: unsigned,
	'genesis-hash': nonEmptyString,
	'genesis-id': nonEmptyString,
	'last-round': unsigned,
	'min-fee': unsigned,
})

const blockHashWire = arktype({
	blockHash: arktype('/^[A-Z2-7]+$/'),
})

const transactionProofHashTypeWire = arktype("'sha512_256'").or(arktype("'sha256'"))

const transactionProofWire = arktype({
	hashtype: transactionProofHashTypeWire,
	idx: unsigned,
	proof: nonEmptyBase64ish,
	stibhash: nonEmptyBase64ish,
	treedepth: unsigned,
})

const applicationBoxWire = arktype({
	name: nonEmptyBase64ish,
	value: 'string',
})

const assertEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Algod_Rest: invalid ${label} envelope`)
	}
}

const assertAddress = (
	address: string,
	label: string
) => {
	if (!addressWire.allows(address))
		throw new Error(`Algod_Rest: invalid ${label}`)
}

const assertTxId = (
	txId: string
) => {
	if (!txIdWire.allows(txId))
		throw new Error('Algod_Rest: invalid transaction id')
}

const assertParticipationId = (
	participationId: string
) => {
	if (!nonEmptyString.allows(participationId))
		throw new Error('Algod_Rest: invalid participation id')
}

const query = (
	path: string
) => (
	getJson<unknown>(binding, path)
)

const assertSignedTransaction = (
	signedTransaction: AlgodSignedTransaction
) => {
	assertAddress(signedTransaction.txn.snd, 'pending transaction sender')
	if (signedTransaction.sgnr != null)
		assertAddress(signedTransaction.sgnr, 'pending transaction signer')
}

export const getStatus = async (): Promise<AlgodNodeStatus> => (
	assertEnvelope(
		statusWire,
		await query('/v2/status'),
		'node status'
	)
)

export const getTransactionParams = async (): Promise<AlgodTransactionParams> => (
	assertEnvelope(
		transactionParamsWire,
		await query('/v2/transactions/params'),
		'transaction params'
	)
)

export const getApplicationBox = async ({
	applicationId,
	boxName,
}: {
	applicationId: bigint
	boxName: string
}): Promise<{
	body: AlgodApplicationBox
	round: bigint
}> => {
	if (applicationId < 0n)
		throw new Error('Algod_Rest: application id must be non-negative')
	if (!nonEmptyBase64ish.allows(boxName))
		throw new Error('Algod_Rest: invalid application box name')

	const response = await sourceFetch(
		binding,
		httpUrl(
			binding,
			`/v2/applications/${applicationId.toString()}/box`,
			{ name: boxName }
		)
	)
	if (!response.ok)
		await throwHttpError('Algod_Rest application box', response)

	const round = response.headers.get('x-algo-round')
	if (round == null || !/^(0|[1-9][0-9]*)$/.test(round))
		throw new Error('Algod_Rest: application box response is missing a valid round')

	const body = assertEnvelope(
		applicationBoxWire,
		await response.json<unknown>(),
		'application box'
	)
	if (body.name !== boxName)
		throw new Error('Algod_Rest: application box name mismatch')

	return {
		body,
		round: BigInt(round),
	}
}

export const getPendingTransactions = async (
	max = 0
): Promise<AlgodPendingTransactions> => {
	if (!Number.isSafeInteger(max) || max < 0)
		throw new Error('Algod_Rest: pending max must be a non-negative safe integer')

	const page = assertEnvelope(
		pendingTransactionsWire,
		await query(`/v2/transactions/pending?max=${max}`),
		'pending transactions'
	) as AlgodPendingTransactions

	if (max > 0 && page['top-transactions'].length > max)
		throw new Error('Algod_Rest: pending transactions exceed requested max')
	if (page['top-transactions'].length > page['total-transactions'])
		throw new Error('Algod_Rest: pending top-transactions exceed total-transactions')

	for (const signedTransaction of page['top-transactions'])
		assertSignedTransaction(signedTransaction)

	return page
}

export const getPendingTransactionsByAddress = async (
	{
		address,
		max = 0,
	}: {
		address: string
		max?: number
	}
): Promise<AlgodPendingTransactions> => {
	assertAddress(address, 'account address')
	if (!Number.isSafeInteger(max) || max < 0)
		throw new Error('Algod_Rest: pending max must be a non-negative safe integer')

	const page = assertEnvelope(
		pendingTransactionsWire,
		await query(`/v2/accounts/${encodeURIComponent(address)}/transactions/pending?max=${max}`),
		'account pending transactions'
	) as AlgodPendingTransactions

	if (max > 0 && page['top-transactions'].length > max)
		throw new Error('Algod_Rest: pending transactions exceed requested max')
	if (page['top-transactions'].length > page['total-transactions'])
		throw new Error('Algod_Rest: pending top-transactions exceed total-transactions')

	for (const signedTransaction of page['top-transactions']) {
		assertSignedTransaction(signedTransaction)
		if (
			signedTransaction.txn.snd !== address
			&& signedTransaction.sgnr !== address
		)
			throw new Error('Algod_Rest: account pending page contains a foreign sender')
	}

	return page
}

export const getPendingTransaction = async (
	txId: string
): Promise<AlgodPendingTransaction> => {
	assertTxId(txId)
	const pending = assertEnvelope(
		pendingTransactionWire,
		await query(`/v2/transactions/pending/${encodeURIComponent(txId)}`),
		'pending transaction'
	) as AlgodPendingTransaction
	assertSignedTransaction(pending.txn)
	return pending
}

export const getParticipationKeys = async (): Promise<AlgodParticipationKey[]> => {
	const keys = assertEnvelope(
		participationKeysWire,
		await query('/v2/participation'),
		'participation keys'
	) as AlgodParticipationKey[]

	const participationIds = new Set<string>()
	for (const key of keys) {
		if (participationIds.has(key.id))
			throw new Error('Algod_Rest: duplicate participation key id')
		participationIds.add(key.id)
		assertAddress(key.address, 'participation key address')
	}

	return keys
}

export const getParticipationKey = async (
	participationId: string
): Promise<AlgodParticipationKey> => {
	assertParticipationId(participationId)
	const key = assertEnvelope(
		participationKeyWire,
		await query(`/v2/participation/${encodeURIComponent(participationId)}`),
		'participation key'
	) as AlgodParticipationKey
	if (key.id !== participationId)
		throw new Error('Algod_Rest: participation key response does not match the subject')
	assertAddress(key.address, 'participation key address')
	return key
}

export const getBlockHash = async (
	round: bigint | number
): Promise<AlgodBlockHash> => {
	if (
		typeof round === 'bigint' ?
			round < 0n || round > BigInt(Number.MAX_SAFE_INTEGER)
		:
			!Number.isSafeInteger(round) || round < 0
	)
		throw new Error('Algod_Rest: block round must be a non-negative safe integer')

	return assertEnvelope(
		blockHashWire,
		await query(`/v2/blocks/${round.toString()}/hash`),
		'block hash'
	) as AlgodBlockHash
}

export const getTransactionProof = async (
	{
		round,
		txId,
		hashType = 'sha512_256',
	}: {
		round: bigint | number
		txId: string
		hashType?: 'sha512_256' | 'sha256'
	}
): Promise<AlgodTransactionProof> => {
	if (
		typeof round === 'bigint' ?
			round < 0n || round > BigInt(Number.MAX_SAFE_INTEGER)
		:
			!Number.isSafeInteger(round) || round < 0
	)
		throw new Error('Algod_Rest: proof round must be a non-negative safe integer')
	assertTxId(txId)
	if (!transactionProofHashTypeWire.allows(hashType))
		throw new Error('Algod_Rest: invalid proof hashtype')

	const proof = assertEnvelope(
		transactionProofWire,
		await query(
			`/v2/blocks/${round.toString()}/transactions/${encodeURIComponent(txId)}/proof?hashtype=${encodeURIComponent(hashType)}`
		),
		'transaction proof'
	) as AlgodTransactionProof

	if (proof.hashtype !== hashType)
		throw new Error('Algod_Rest: transaction proof hashtype does not match the request')

	return proof
}
