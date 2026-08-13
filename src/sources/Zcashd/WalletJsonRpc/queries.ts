import bindings from '$/sources/Zcashd/bindings.ts'
import { zcashdTransaction } from '$/sources/Zcashd/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import { type as arktype } from 'arktype'


const binding = bindings[Source.ZcashdWallet_JsonRpc][0]
const zecAmount = arktype('/^(?:0|[1-9][0-9]*)(?:\\.[0-9]{1,8})?$/')
const totalBalanceWire = arktype({
	transparent: zecAmount,
	private: zecAmount,
	total: zecAmount,
}).onUndeclaredKey('delete')
const blockCountWire = arktype('number.integer >= 0')
const shieldedNoteWire = arktype({
	txid: 'string',
	pool: "'sprout' | 'sapling' | 'orchard'",
	'jsindex?': 'number.integer >= 0',
	'jsoutindex?': 'number.integer >= 0',
	'outindex?': 'number.integer >= 0',
	confirmations: 'number.integer >= 0',
	spendable: 'boolean',
	'account?': 'number.integer >= 0',
	'address?': 'string',
	amount: 'number',
	memo: 'string',
	'memoStr?': 'string',
	change: 'boolean',
})
const shieldedNotesWire = shieldedNoteWire.array()

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	value: unknown
) => {
	try {
		return wire.assert(value)
	} catch {
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid ${label} response envelope`)
	}
}

const zatoshisFromZecString = (
	amount: string,
	label: string
) => {
	const [whole, fraction = ''] = amount.split('.')
	const zatoshis = BigInt(whole) * 100_000_000n + BigInt(fraction.padEnd(8, '0'))
	if (zatoshis < 0n)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid ${label}`)

	return zatoshis
}

const zatoshisFromZecNumber = (
	amount: number,
	label: string
) => {
	const zatoshis = Math.round(amount * 100_000_000)
	if (
		!Number.isFinite(amount)
		|| amount < 0
		|| !Number.isSafeInteger(zatoshis)
		|| Math.abs(amount - zatoshis / 100_000_000) > Number.EPSILON
	)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid or lossy ${label}`)

	return BigInt(zatoshis)
}

const assertHash = (
	value: string,
	label: string
) => {
	if (!/^[0-9a-f]{64}$/i.test(value))
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid ${label}`)
}

const getTotalBalance = async (minimumConfirmations: number) => {
	const balance = assertEnvelope(
		'total balance',
		totalBalanceWire,
		await jsonRpc2<unknown>(binding, 'z_gettotalbalance', [minimumConfirmations, true])
	)
	const transparentZatoshis = zatoshisFromZecString(balance.transparent, 'transparent balance')
	const privateZatoshis = zatoshisFromZecString(balance.private, 'private balance')
	const totalZatoshis = zatoshisFromZecString(balance.total, 'total balance')
	if (transparentZatoshis + privateZatoshis !== totalZatoshis)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: total balance does not equal transparent plus private balance`)

	return {
		transparentZatoshis,
		privateZatoshis,
		totalZatoshis,
	}
}

export const getWalletObservation = async () => {
	const [unconfirmed, confirmed, chainTipHeight] = await Promise.all([
		getTotalBalance(0),
		getTotalBalance(1),
		jsonRpc2<unknown>(binding, 'getblockcount', [])
			.then((value) => assertEnvelope('block count', blockCountWire, value)),
	])
	if (confirmed.totalZatoshis > unconfirmed.totalZatoshis)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: confirmed balance exceeds total balance`)

	return {
		balanceZatoshis: unconfirmed.totalZatoshis,
		verifiedBalanceZatoshis: confirmed.totalZatoshis,
		unshieldedBalanceZatoshis: unconfirmed.transparentZatoshis,
		privateBalanceZatoshis: unconfirmed.privateZatoshis,
		chainTipHeight: BigInt(chainTipHeight),
	}
}

export const getWalletNotes = async (maximumNotes: number) => {
	if (!Number.isSafeInteger(maximumNotes) || maximumNotes < 0 || maximumNotes > 10_000)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: note limit must be an integer from 0 through 10000`)

	const chainTipHeight = assertEnvelope(
		'block count',
		blockCountWire,
		await jsonRpc2<unknown>(binding, 'getblockcount', [])
	)
	const notes = assertEnvelope(
		'shielded notes',
		shieldedNotesWire,
		await jsonRpc2<unknown>(binding, 'z_listunspent', [0, 9_999_999, true, []])
	)
	if (
		assertEnvelope(
			'block count',
			blockCountWire,
			await jsonRpc2<unknown>(binding, 'getblockcount', [])
		) !== chainTipHeight
	)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: chain tip changed during note observation`)

	const observedAtMs = Date.now()
	const noteCommitments = new Set<string>()

	return Promise.all(notes.slice(0, maximumNotes).map(async (note) => {
		assertHash(note.txid, 'note transaction ID')
		if (!/^(?:[0-9a-f]{2})*$/i.test(note.memo))
			throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid note memo`)

		const transaction = assertEnvelope(
			'note transaction',
			zcashdTransaction,
			await jsonRpc2<unknown>(binding, 'getrawtransaction', [note.txid, 1])
		)
		if (transaction.txid.toLowerCase() !== note.txid.toLowerCase())
			throw new Error(`${Source.ZcashdWallet_JsonRpc}: note transaction does not match request`)

		const noteCommitment = (
			note.pool === 'sprout' ?
				(
					note.jsindex == null || note.jsoutindex == null ?
						undefined
					:
						transaction.vjoinsplit?.[note.jsindex]?.commitments[note.jsoutindex]
				)
			: note.outindex == null ?
				undefined
			: note.pool === 'sapling' ?
				transaction.vShieldedOutput?.[note.outindex]?.cmu
			:
				transaction.orchard?.actions[note.outindex]?.cmx
		)
		if (noteCommitment == null)
			throw new Error(`${Source.ZcashdWallet_JsonRpc}: note output coordinate is absent from transaction`)
		assertHash(noteCommitment, 'note commitment')
		if (noteCommitments.has(noteCommitment))
			throw new Error(`${Source.ZcashdWallet_JsonRpc}: duplicate note commitment`)
		noteCommitments.add(noteCommitment)

		if (note.confirmations > chainTipHeight + 1)
			throw new Error(`${Source.ZcashdWallet_JsonRpc}: note confirmations exceed chain height`)

		return {
			...note,
			noteCommitment,
			valueZatoshis: zatoshisFromZecNumber(note.amount, 'note amount'),
			...(note.confirmations > 0 && {
				receivedAtHeight: BigInt(chainTipHeight - note.confirmations + 1),
			}),
			observedAtMs,
		}
	}))
}
