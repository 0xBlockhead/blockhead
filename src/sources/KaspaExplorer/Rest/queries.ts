import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { getJson, httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { paths } from '$/sources/KaspaExplorer/OpenApi/openapi.d.ts'
import bindings from '$/sources/KaspaExplorer/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.KaspaExplorer][0]

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
		throw new Error('Kaspa Explorer: invalid Kaspa mainnet address')
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Kaspa Explorer: ${label} exceeds lossless JSON integer range`)
}

const assertUnsignedDecimal = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`Kaspa Explorer: invalid ${label}`)
}


const assertBlockHash = (
	blockHash: string,
	label = 'block hash'
) => {
	if (!/^[0-9a-f]{64}$/.test(blockHash))
		throw new Error(`Kaspa Explorer: invalid ${label}`)
}

const assertTransactionId = (
	transactionId: string
) => {
	if (!/^[0-9a-f]{64}$/.test(transactionId))
		throw new Error('Kaspa Explorer: invalid transaction ID')
}

const assertSafeUnsignedDecimalString = (
	value: string,
	label: string
) => {
	assertUnsignedDecimal(value, label)
	if (!Number.isSafeInteger(Number(value)))
		throw new Error(`Kaspa Explorer: ${label} exceeds lossless JSON integer range`)
}

const validateTxModelLeftovers = (
	transaction: paths['/transactions/{transaction_id}']['get']['responses'][200]['content']['application/json']
) => {
	if (transaction.transaction_id == null)
		throw new Error('Kaspa Explorer: invalid transaction ID')
	assertTransactionId(transaction.transaction_id)
	if (transaction.version != null)
		assertSafeUnsigned(transaction.version, 'transaction version')
	if (transaction.mass != null)
		assertUnsignedDecimal(transaction.mass, 'transaction mass')
	if (transaction.payload != null) {
		if (!/^(?:[0-9a-fA-F]{2})*$/.test(transaction.payload))
			throw new Error('Kaspa Explorer: transaction payload is not even hex')
	}
	if (transaction.block_hash != null) {
		const blockHashes = new Set<string>()
		for (const blockHash of transaction.block_hash) {
			assertBlockHash(blockHash)
			if (blockHashes.has(blockHash))
				throw new Error('Kaspa Explorer: duplicate transaction block hash')
			blockHashes.add(blockHash)
		}
	}
	if (transaction.block_time != null)
		assertSafeUnsigned(transaction.block_time, 'transaction block time')
	if (transaction.is_accepted === true && transaction.accepting_block_hash == null)
		throw new Error('Kaspa Explorer: accepted transaction is missing its accepting block hash')
	if (transaction.is_accepted !== true && transaction.accepting_block_hash != null)
		throw new Error('Kaspa Explorer: unaccepted transaction has an accepting block hash')
	if (transaction.accepting_block_hash != null)
		assertBlockHash(transaction.accepting_block_hash, 'accepting block hash')
	for (const input of transaction.inputs ?? []) {
		if (input.previous_outpoint_amount != null)
			assertSafeUnsigned(input.previous_outpoint_amount, 'transaction input amount')
	}
	for (const output of transaction.outputs ?? [])
		assertSafeUnsigned(output.amount, 'transaction output amount')
	return transaction
}

export const getAddressBalance = async (
	{ kaspaAddress }: paths['/addresses/{kaspaAddress}/balance']['get']['parameters']['path']
) => {
	assertAddress(kaspaAddress)
	const balance = await getJson<paths['/addresses/{kaspaAddress}/balance']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/addresses/${encodeURIComponent(kaspaAddress)}/balance`
	)
	if (balance.address !== kaspaAddress)
		throw new Error('Kaspa Explorer: balance response belongs to a different address')
	assertSafeUnsigned(balance.balance, 'balance')
	return balance
}

export const getAddressUtxos = async (
	{ kaspaAddress }: paths['/addresses/{kaspaAddress}/utxos']['get']['parameters']['path']
) => {
	assertAddress(kaspaAddress)
	const utxos = await getJson<paths['/addresses/{kaspaAddress}/utxos']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/addresses/${encodeURIComponent(kaspaAddress)}/utxos`
	)
	const outpoints = new Set<string>()
	for (const utxo of utxos) {
		if (utxo.address !== kaspaAddress)
			throw new Error('Kaspa Explorer: UTXO response contains a foreign address')
		if (!/^[0-9a-f]{64}$/.test(utxo.outpoint.transactionId))
			throw new Error('Kaspa Explorer: invalid UTXO transaction ID')
		assertSafeUnsigned(utxo.outpoint.index, 'UTXO outpoint index')
		assertUnsignedDecimal(utxo.utxoEntry.amount, 'UTXO amount')
		assertUnsignedDecimal(utxo.utxoEntry.blockDaaScore, 'UTXO block DAA score')
		const outpoint = `${utxo.outpoint.transactionId}:${utxo.outpoint.index}`
		if (outpoints.has(outpoint))
			throw new Error('Kaspa Explorer: duplicate UTXO outpoint')
		outpoints.add(outpoint)
	}
	return utxos
}

export const getAddressUtxoCount = async (
	{ kaspaAddress }: paths['/addresses/{kaspaAddress}/utxos/count']['get']['parameters']['path']
) => {
	assertAddress(kaspaAddress)
	const count = await getJson<paths['/addresses/{kaspaAddress}/utxos/count']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/addresses/${encodeURIComponent(kaspaAddress)}/utxos/count`
	)
	assertSafeUnsigned(count.count, 'UTXO count')
	return count
}

export const getCompleteAddressUtxos = async (
	parameters: paths['/addresses/{kaspaAddress}/utxos']['get']['parameters']['path']
) => {
	const [utxos, { count }] = await Promise.all([
		getAddressUtxos(parameters),
		getAddressUtxoCount(parameters),
	])
	if (utxos.length !== count)
		throw new Error('Kaspa Explorer: address UTXO response is incomplete')
	return utxos
}

export const getAddressTransactionCount = async (
	{ kaspaAddress }: paths['/addresses/{kaspaAddress}/transactions-count']['get']['parameters']['path']
) => {
	assertAddress(kaspaAddress)
	const count = await getJson<paths['/addresses/{kaspaAddress}/transactions-count']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/addresses/${encodeURIComponent(kaspaAddress)}/transactions-count`
	)
	assertSafeUnsigned(count.total, 'transaction count')
	return count
}

export const getAddressTransactionsPage = async (
	{
		kaspaAddress,
		limit = 50,
		before,
		after,
	}: (
		paths['/addresses/{kaspaAddress}/full-transactions-page']['get']['parameters']['path']
		& NonNullable<paths['/addresses/{kaspaAddress}/full-transactions-page']['get']['parameters']['query']>
	)
) => {
	assertAddress(kaspaAddress)
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 500)
		throw new Error('Kaspa Explorer: transaction page limit must be an integer from 1 through 500')
	if (before != null)
		assertSafeUnsigned(before, 'before cursor')
	if (after != null)
		assertSafeUnsigned(after, 'after cursor')
	if (before != null && after != null)
		throw new Error('Kaspa Explorer: transaction page cannot use both before and after cursors')
	const parameters = new URLSearchParams({
		limit: limit.toString(),
		resolve_previous_outpoints: 'light',
	})
	if (before != null)
		parameters.set('before', before.toString())
	if (after != null)
		parameters.set('after', after.toString())
	const path = `/addresses/${encodeURIComponent(kaspaAddress)}/full-transactions-page?${parameters.toString()}`
	const response = await sourceFetch(binding, httpUrl(binding, path))
	if (!response.ok)
		await throwHttpError(`${binding.source} ${path}`, response)

	const transactions = await response.json<paths['/addresses/{kaspaAddress}/full-transactions-page']['get']['responses'][200]['content']['application/json']>()
	if (transactions.length > limit)
		throw new Error('Kaspa Explorer: transaction page exceeds requested limit')
	const transactionIds = new Set<string>()
	let previousBlockTime: number | undefined
	const validatedTransactions = []
	for (const transaction of transactions) {
		validateTxModelLeftovers(transaction)
		const transactionId = transaction.transaction_id
		const blockTime = transaction.block_time
		if (transactionId == null)
			throw new Error('Kaspa Explorer: invalid transaction ID')
		if (blockTime == null)
			throw new Error('Kaspa Explorer: transaction is missing its pagination clock')
		if (transactionIds.has(transactionId))
			throw new Error('Kaspa Explorer: duplicate transaction ID')
		transactionIds.add(transactionId)
		if (
			previousBlockTime != null
			&& blockTime > previousBlockTime
		)
			throw new Error('Kaspa Explorer: transaction page is not newest-first')
		if (before != null && blockTime >= before)
			throw new Error('Kaspa Explorer: transaction page did not respect its before cursor')
		previousBlockTime = blockTime
		if (
			transaction.inputs?.some((input) => input.previous_outpoint_address === kaspaAddress) !== true
			&& transaction.outputs?.some((output) => output.script_public_key_address === kaspaAddress) !== true
		)
			throw new Error('Kaspa Explorer: transaction page contains a foreign address row')
		validatedTransactions.push({
			...transaction,
			block_time: blockTime,
			transaction_id: transactionId,
		})
	}
	const nextBeforeHeader = response.headers.get('x-next-page-before')
	const nextBefore = nextBeforeHeader == null ?
		undefined
	:
		Number(nextBeforeHeader)
	if (
		nextBefore != null
		&& (
			!Number.isSafeInteger(nextBefore)
			|| nextBefore < 0
			|| nextBefore.toString() !== nextBeforeHeader
		)
	)
		throw new Error('Kaspa Explorer: invalid next-page-before header')

	return {
		transactions: validatedTransactions,
		nextBefore,
	}
}

export const getTransaction = async (
	{
		transaction_id,
		blockHash,
		inputs = true,
		outputs = true,
		resolve_previous_outpoints = 'light',
	}: (
		paths['/transactions/{transaction_id}']['get']['parameters']['path']
		& NonNullable<paths['/transactions/{transaction_id}']['get']['parameters']['query']>
	)
) => {
	assertTransactionId(transaction_id)
	if (blockHash != null)
		assertBlockHash(blockHash)
	const parameters = new URLSearchParams({
		inputs: String(inputs),
		outputs: String(outputs),
		resolve_previous_outpoints,
	})
	if (blockHash != null)
		parameters.set('blockHash', blockHash)
	const transaction = await getJson<paths['/transactions/{transaction_id}']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/transactions/${transaction_id}?${parameters.toString()}`
	)
	validateTxModelLeftovers(transaction)
	if (transaction.transaction_id !== transaction_id)
		throw new Error('Kaspa Explorer: transaction response belongs to a different ID')
	if (
		blockHash != null
		&& transaction.accepting_block_hash !== blockHash
	)
		throw new Error('Kaspa Explorer: transaction is not accepted by the requested block')
	return transaction
}

export const getBlock = async (
	{
		blockId,
		includeTransactions = false,
		includeColor = false,
	}: (
		paths['/blocks/{blockId}']['get']['parameters']['path']
		& NonNullable<paths['/blocks/{blockId}']['get']['parameters']['query']>
	)
) => {
	assertBlockHash(blockId)
	const parameters = new URLSearchParams({
		includeTransactions: String(includeTransactions),
		includeColor: String(includeColor),
	})
	const block = await getJson<paths['/blocks/{blockId}']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/blocks/${blockId}?${parameters.toString()}`
	)
	if (block.verboseData.hash != null) {
		assertBlockHash(block.verboseData.hash)
		if (block.verboseData.hash !== blockId)
			throw new Error('Kaspa Explorer: block response belongs to a different hash')
	}
	if (block.header.version != null)
		assertSafeUnsigned(block.header.version, 'block version')
	if (block.header.timestamp != null)
		assertSafeUnsignedDecimalString(block.header.timestamp, 'block timestamp')
	if (block.header.bits != null)
		assertSafeUnsigned(block.header.bits, 'block bits')
	if (block.header.nonce != null)
		assertUnsignedDecimal(block.header.nonce, 'block nonce')
	if (block.header.daaScore != null)
		assertUnsignedDecimal(block.header.daaScore, 'block DAA score')
	if (block.header.blueScore != null)
		assertUnsignedDecimal(block.header.blueScore, 'block blue score')
	if (block.verboseData.blueScore != null)
		assertUnsignedDecimal(block.verboseData.blueScore, 'verbose blue score')
	if (block.verboseData.selectedParentHash != null)
		assertBlockHash(block.verboseData.selectedParentHash, 'selected parent hash')
	for (const parent of block.header.parents ?? [])
		for (const parentHash of parent.parentHashes ?? [])
			assertBlockHash(parentHash, 'parent hash')
	for (const mergeSetHash of block.verboseData.mergeSetBluesHashes ?? [])
		assertBlockHash(mergeSetHash, 'merge-set blue hash')
	for (const mergeSetHash of block.verboseData.mergeSetRedsHashes ?? [])
		assertBlockHash(mergeSetHash, 'merge-set red hash')
	return block
}

export const getBlockdag = async () => {
	const blockdag = await getJson<paths['/info/blockdag']['get']['responses'][200]['content']['application/json']>(
		binding,
		'/info/blockdag'
	)
	assertSafeUnsignedDecimalString(blockdag.blockCount, 'block count')
	assertSafeUnsignedDecimalString(blockdag.headerCount, 'header count')
	assertSafeUnsignedDecimalString(blockdag.virtualDaaScore, 'virtual DAA score')
	assertSafeUnsignedDecimalString(blockdag.pastMedianTime, 'past median time')
	assertBlockHash(blockdag.pruningPointHash, 'pruning point hash')
	assertBlockHash(blockdag.sink, 'sink hash')
	if (!Number.isFinite(blockdag.difficulty) || blockdag.difficulty < 0)
		throw new Error('Kaspa Explorer: invalid difficulty')
	for (const tipHash of blockdag.tipHashes)
		assertBlockHash(tipHash, 'tip hash')
	for (const virtualParentHash of blockdag.virtualParentHashes)
		assertBlockHash(virtualParentHash, 'virtual parent hash')
	return blockdag
}

export const getVirtualChainBlueScore = async () => {
	const blueScore = await getJson<paths['/info/virtual-chain-blue-score']['get']['responses'][200]['content']['application/json']>(
		binding,
		'/info/virtual-chain-blue-score'
	)
	assertSafeUnsigned(blueScore.blueScore, 'virtual blue score')
	return blueScore
}

export const getKaspadInfo = async () => {
	const info = await getJson<paths['/info/kaspad']['get']['responses'][200]['content']['application/json']>(
		binding,
		'/info/kaspad'
	)
	if (info.mempoolSize != null)
		assertSafeUnsignedDecimalString(info.mempoolSize, 'mempool size')
	return info
}
