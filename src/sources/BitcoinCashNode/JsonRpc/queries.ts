import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	bitcoinCashBlock,
	bitcoinCashBlockCount,
	bitcoinCashBlockHash,
	bitcoinCashMempoolInfo,
	bitcoinCashScanTxOutSet,
	bitcoinCashTokenData,
	bitcoinCashTransaction,
	bitcoinCashValidatedAddress,
	type BitcoinCashTokenData,
	type BitcoinCashTransaction,
} from '$/sources/BitcoinCashNode/JsonRpc/types.ts'
import type { BitcoinCoreBlock } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'
import bindings from '$/sources/BitcoinCashNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.BitcoinCashNode_JsonRpc][0]

const core = bitcoinCoreJsonRpc<
	BitcoinCoreBlock,
	BitcoinCashTransaction
>(binding, true)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.BitcoinCashNode_JsonRpc}: invalid ${label} response envelope`)
	}
}

const assertCashAddress = (address: string) => {
	if (!/^bitcoincash:[qpzr][qpzry9x8gf2tvdw0s3jn54khce6mua7l]{41,111}$/.test(address))
		throw new Error('BitcoinCashNode_JsonRpc: invalid explicit-mainnet CashAddr')
}

const assertSafeUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`BitcoinCashNode_JsonRpc: ${label} exceeds lossless JSON integer range`)
}

const assertHash = (
	value: string,
	label: string
) => {
	if (!/^[0-9a-f]{64}$/i.test(value))
		throw new Error(`BitcoinCashNode_JsonRpc: invalid ${label}`)
}

const zatoshisFromBch = (
	value: number,
	label: string
) => {
	const zatoshis = Math.round(value * 100_000_000)
	if (
		!Number.isFinite(value)
		|| value < 0
		|| !Number.isSafeInteger(zatoshis)
		|| Math.abs(value - zatoshis / 100_000_000) > Number.EPSILON
	)
		throw new Error(`BitcoinCashNode_JsonRpc: invalid or lossy ${label}`)
	return BigInt(zatoshis)
}

const assertTokenData = (tokenData: BitcoinCashTokenData) => {
	assertEnvelope('CashToken data', bitcoinCashTokenData, tokenData)
	assertHash(tokenData.category, 'CashToken category')
	if (tokenData.amount != null) {
		try {
			if (BigInt(tokenData.amount) < 0n)
				throw new Error()
		} catch {
			throw new Error('BitcoinCashNode_JsonRpc: invalid CashToken fungible amount')
		}
	}
	if (tokenData.nft != null && !/^(?:[0-9a-f]{2})*$/i.test(tokenData.nft.commitment))
		throw new Error('BitcoinCashNode_JsonRpc: invalid CashToken NFT commitment')
}

export const getBlockHash = async ({
	height,
}: {
	height: bigint
}) => {
	if (height < 0n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('BitcoinCashNode_JsonRpc: block height exceeds lossless JSON integer range')
	const hash = assertEnvelope(
		'block hash',
		bitcoinCashBlockHash,
		await core.getBlockHash({
			height,
		})
	)
	assertHash(hash, 'block hash')
	return hash
}

export const getBlockCount = async () => (
	assertEnvelope(
		'block count',
		bitcoinCashBlockCount,
		await jsonRpc2<unknown>(binding, 'getblockcount', [])
	)
)

export const getMempoolInfo = async () => (
	assertEnvelope(
		'mempool info',
		bitcoinCashMempoolInfo,
		await core.getMempoolInfo()
	)
)

export const getRawTransaction = async ({
	txId,
}: {
	txId: string
}) => {
	assertHash(txId, 'transaction id')
	const transaction = assertEnvelope(
		'transaction',
		bitcoinCashTransaction,
		await core.getRawTransaction({
			txId,
		})
	)
	if (transaction.txid.toLowerCase() !== txId.toLowerCase())
		throw new Error('BitcoinCashNode_JsonRpc: transaction id does not match request')
	for (const output of transaction.vout) {
		if (output.tokenData != null)
			assertTokenData(output.tokenData)
	}
	return transaction
}

export const getBlock = async ({
	blockHash,
	verbosity = 2,
}: {
	blockHash: string
	verbosity?: 0 | 1 | 2
}) => {
	assertHash(blockHash, 'block hash')
	if (verbosity === 0) {
		const hex = assertEnvelope(
			'block hex',
			bitcoinCashBlockHash,
			await jsonRpc2<unknown>(
				binding,
				'getblock',
				[
					blockHash,
					0,
				]
			)
		)
		if (!/^(?:[0-9a-f]{2})+$/i.test(hex))
			throw new Error('BitcoinCashNode_JsonRpc: invalid block hex')
		return hex
	}

	const block = assertEnvelope(
		'block',
		bitcoinCashBlock,
		await jsonRpc2<unknown>(
			binding,
			'getblock',
			[
				blockHash,
				verbosity,
			]
		)
	)
	if (block.hash.toLowerCase() !== blockHash.toLowerCase())
		throw new Error('BitcoinCashNode_JsonRpc: block hash does not match request')
	assertSafeUnsignedInteger(block.height, 'block height')
	assertSafeUnsignedInteger(block.nTx, 'block transaction count')
	return block
}

export const getTransparentAddressUtxos = async ({
	address,
	maxResults,
}: {
	address: string
	maxResults: number
}) => {
	assertCashAddress(address)
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error('BitcoinCashNode_JsonRpc: UTXO result limit must be an integer from 0 through 10000')
	if (maxResults === 0)
		return {
			unspents: [],
			totalAmountZatoshis: 0n,
			tokenTotalAmountByCategory: {},
		}

	const validatedAddress = assertEnvelope(
		'validated address',
		bitcoinCashValidatedAddress,
		await jsonRpc2<unknown>(
			binding,
			'validateaddress',
			[address]
		)
	)
	if (!validatedAddress.isvalid || validatedAddress.address !== address)
		throw new Error('BitcoinCashNode_JsonRpc: node rejected or canonicalized the CashAddr identity')

	const result = assertEnvelope(
		'scantxoutset',
		bitcoinCashScanTxOutSet,
		await jsonRpc2<unknown>(
			binding,
			'scantxoutset',
			[
				'start',
				[`addr(${address})`],
			]
		)
	)
	if (result.success === false)
		throw new Error('BitcoinCashNode_JsonRpc: UTXO scan did not complete')
	if (result.unspents.length > maxResults)
		throw new Error('BitcoinCashNode_JsonRpc: UTXO response exceeds requested result limit')
	const outpoints = new Set<string>()
	for (const utxo of result.unspents) {
		assertHash(utxo.txid, 'UTXO transaction ID')
		assertSafeUnsignedInteger(utxo.vout, 'UTXO output index')
		assertSafeUnsignedInteger(utxo.height, 'UTXO block height')
		if (!/^(?:[0-9a-f]{2})*$/i.test(utxo.scriptPubKey))
			throw new Error('BitcoinCashNode_JsonRpc: invalid UTXO script')
		zatoshisFromBch(utxo.amount, 'UTXO BCH amount')
		if (utxo.tokenData != null)
			assertTokenData(utxo.tokenData)
		const outpoint = `${utxo.txid}:${utxo.vout}`
		if (outpoints.has(outpoint))
			throw new Error('BitcoinCashNode_JsonRpc: duplicate UTXO outpoint')
		outpoints.add(outpoint)
	}

	const tokenTotalAmountByCategory: Record<string, bigint> = {}
	for (const [category, amount] of Object.entries(result.token_total_amount ?? {})) {
		assertHash(category, 'CashToken total category')
		try {
			tokenTotalAmountByCategory[category] = BigInt(amount)
			if (tokenTotalAmountByCategory[category] < 0n)
				throw new Error()
		} catch {
			throw new Error('BitcoinCashNode_JsonRpc: invalid CashToken total amount')
		}
	}
	return {
		unspents: result.unspents.map((utxo) => ({
			...utxo,
			valueZatoshis: zatoshisFromBch(utxo.amount, 'UTXO BCH amount'),
		})),
		totalAmountZatoshis: zatoshisFromBch(result.total_amount, 'total BCH amount'),
		tokenTotalAmountByCategory,
	}
}
