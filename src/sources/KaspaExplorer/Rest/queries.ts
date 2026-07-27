import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/KaspaExplorer/bindings.ts'
import type {
	KaspaExplorerBalance,
	KaspaExplorerTransaction,
	KaspaExplorerTransactionCount,
	KaspaExplorerUtxo,
	KaspaExplorerUtxoCount,
} from '$/sources/KaspaExplorer/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.KaspaExplorer_Rest]

const kaspaAddressCharset = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

const kaspaAddressPolymod = (
	values: number[]
) => {
	let checksum = 1n
	for (const value of values) {
		const highBits = checksum >> 35n
		checksum = ((checksum & 0x07ffffffffn) << 5n) ^ BigInt(value)
		for (const [bit, generator] of [
			[0x01n, 0x98f2bc8e61n],
			[0x02n, 0x79b76d99e2n],
			[0x04n, 0xf33e5fb3c4n],
			[0x08n, 0xae2eabe2a8n],
			[0x10n, 0x1e4f43e470n],
		])
			if ((highBits & bit) !== 0n)
				checksum ^= generator
	}
	return checksum ^ 1n
}

const assertAddress = (address: string) => {
	const prefix = 'kaspa'
	const payload = address.slice(prefix.length + 1)
	const payloadValues = [...payload].map((character) => (
		kaspaAddressCharset.indexOf(character)
	))
	if (
		!address.startsWith(`${prefix}:`)
		|| (payload.length !== 61 && payload.length !== 63)
		|| payloadValues.some((value) => value < 0)
		|| kaspaAddressPolymod([
			...[...prefix].map((character) => character.charCodeAt(0) & 31),
			0,
			...payloadValues,
		]) !== 0n
	)
		throw new Error('KaspaExplorer_Rest: invalid Kaspa mainnet address')
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`KaspaExplorer_Rest: ${label} exceeds lossless JSON integer range`)
}

const assertUnsignedDecimal = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`KaspaExplorer_Rest: invalid ${label}`)
}

export const query = <_Json>(
	path: string
) => (
	getJson<_Json>(binding, path)
)

export const getAddressBalance = async (
	address: string
) => {
	assertAddress(address)
	const balance = await query<KaspaExplorerBalance>(
		`/addresses/${encodeURIComponent(address)}/balance`
	)
	if (balance.address !== address)
		throw new Error('KaspaExplorer_Rest: balance response belongs to a different address')
	assertSafeUnsigned(balance.balance, 'balance')
	return balance
}

export const getAddressUtxos = async (
	address: string
) => {
	assertAddress(address)
	const utxos = await query<KaspaExplorerUtxo[]>(
		`/addresses/${encodeURIComponent(address)}/utxos`
	)
	const outpoints = new Set<string>()
	for (const utxo of utxos) {
		if (utxo.address !== address)
			throw new Error('KaspaExplorer_Rest: UTXO response contains a foreign address')
		if (!/^[0-9a-f]{64}$/.test(utxo.outpoint.transactionId))
			throw new Error('KaspaExplorer_Rest: invalid UTXO transaction ID')
		assertSafeUnsigned(utxo.outpoint.index, 'UTXO outpoint index')
		if (utxo.utxoEntry.amount != null)
			assertUnsignedDecimal(utxo.utxoEntry.amount, 'UTXO amount')
		if (utxo.utxoEntry.blockDaaScore != null)
			assertUnsignedDecimal(utxo.utxoEntry.blockDaaScore, 'UTXO block DAA score')
		const outpoint = `${utxo.outpoint.transactionId}:${utxo.outpoint.index}`
		if (outpoints.has(outpoint))
			throw new Error('KaspaExplorer_Rest: duplicate UTXO outpoint')
		outpoints.add(outpoint)
	}
	return utxos
}

export const getAddressUtxoCount = async (
	address: string
) => {
	assertAddress(address)
	const count = await query<KaspaExplorerUtxoCount>(
		`/addresses/${encodeURIComponent(address)}/utxos/count`
	)
	assertSafeUnsigned(count.count, 'UTXO count')
	return count
}

export const getCompleteAddressUtxos = async (
	address: string
) => {
	const [utxos, { count }] = await Promise.all([
		getAddressUtxos(address),
		getAddressUtxoCount(address),
	])
	if (utxos.length !== count)
		throw new Error('KaspaExplorer_Rest: address UTXO response is incomplete')
	return utxos
}

export const getAddressTransactionCount = async (
	address: string
) => {
	assertAddress(address)
	const count = await query<KaspaExplorerTransactionCount>(
		`/addresses/${encodeURIComponent(address)}/transactions-count`
	)
	assertSafeUnsigned(count.total, 'transaction count')
	return count
}

export const getAddressTransactionsPage = async (
	{
		address,
		limit,
		before,
		after,
	}: {
		address: string
		limit: number
		before?: number
		after?: number
	}
) => {
	assertAddress(address)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 500)
		throw new Error('KaspaExplorer_Rest: transaction page limit must be an integer from 1 through 500')
	if (before != null)
		assertSafeUnsigned(before, 'before cursor')
	if (after != null)
		assertSafeUnsigned(after, 'after cursor')
	if (before != null && after != null)
		throw new Error('KaspaExplorer_Rest: transaction page cannot use both before and after cursors')
	const parameters = new URLSearchParams({
		limit: limit.toString(),
		resolve_previous_outpoints: 'light',
	})
	if (before != null)
		parameters.set('before', before.toString())
	if (after != null)
		parameters.set('after', after.toString())
	const transactions = await query<KaspaExplorerTransaction[]>(
		`/addresses/${encodeURIComponent(address)}/full-transactions-page?${parameters.toString()}`
	)
	if (transactions.length > limit)
		throw new Error('KaspaExplorer_Rest: transaction page exceeds requested limit')
	const transactionIds = new Set<string>()
	let previousBlockTime: number | undefined
	const validatedTransactions = []
	for (const transaction of transactions) {
		if (transaction.transaction_id == null || !/^[0-9a-f]{64}$/.test(transaction.transaction_id))
			throw new Error('KaspaExplorer_Rest: invalid transaction ID')
		if (transactionIds.has(transaction.transaction_id))
			throw new Error('KaspaExplorer_Rest: duplicate transaction ID')
		transactionIds.add(transaction.transaction_id)
		if (transaction.mass != null)
			assertUnsignedDecimal(transaction.mass, 'transaction mass')
		if (transaction.block_time == null)
			throw new Error('KaspaExplorer_Rest: transaction is missing its pagination clock')
		assertSafeUnsigned(transaction.block_time, 'transaction block time')
		if (
			previousBlockTime != null
			&& transaction.block_time > previousBlockTime
		)
			throw new Error('KaspaExplorer_Rest: transaction page is not newest-first')
		if (before != null && transaction.block_time >= before)
			throw new Error('KaspaExplorer_Rest: transaction page did not respect its before cursor')
		previousBlockTime = transaction.block_time
		for (const input of transaction.inputs ?? [])
			if (input.previous_outpoint_amount != null)
				assertSafeUnsigned(input.previous_outpoint_amount, 'transaction input amount')
		for (const output of transaction.outputs ?? [])
			assertSafeUnsigned(output.amount, 'transaction output amount')
		if (
			transaction.inputs?.some((input) => input.previous_outpoint_address === address) !== true
			&& transaction.outputs?.some((output) => output.script_public_key_address === address) !== true
		)
			throw new Error('KaspaExplorer_Rest: transaction page contains a foreign address row')
		validatedTransactions.push({
			...transaction,
			block_time: transaction.block_time,
			transaction_id: transaction.transaction_id,
		})
	}
	return validatedTransactions
}
