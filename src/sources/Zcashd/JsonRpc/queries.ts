import bindings from '$/sources/Zcashd/bindings.ts'
import {
	zcashdBlock,
	zcashdBlockCount,
	zcashdBlockHash,
	zcashdMempoolInfo,
	zcashdScanTxOutSet,
	zcashdTransaction,
	zcashdTreeState,
	zcashdValidatedAddress,
	type ZcashBlock,
	type ZcashdScanTxOutSet,
} from '$/sources/Zcashd/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

const binding = bindings[Source.Zcashd_JsonRpc][0]

const core = bitcoinCoreJsonRpc<ZcashBlock>(binding, 1)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.Zcashd_JsonRpc}: invalid ${label} response envelope`)
	}
}

const assertSafeUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${Source.Zcashd_JsonRpc}: ${label} exceeds lossless JSON integer range`)
}

const assertHash = (
	value: string,
	label: string
) => {
	if (!/^[0-9a-f]{64}$/i.test(value))
		throw new Error(`${Source.Zcashd_JsonRpc}: invalid ${label}`)
}

const satoshisFromZec = (
	value: number,
	label: string
) => {
	const satoshis = Math.round(value * 100_000_000)
	if (
		!Number.isFinite(value)
		|| value < 0
		|| !Number.isSafeInteger(satoshis)
		|| Math.abs(value - satoshis / 100_000_000) > Number.EPSILON
	)
		throw new Error(`${Source.Zcashd_JsonRpc}: invalid or lossy ${label}`)
	return BigInt(satoshis)
}

const assertTransparentAddress = (address: string) => {
	if (!/^t[13][1-9A-HJ-NP-Za-km-z]{33}$/.test(address))
		throw new Error(`${Source.Zcashd_JsonRpc}: invalid Zcash mainnet transparent address`)
}

export const getBlock = async ({
	blockHash,
}: {
	blockHash: string
}) => {
	assertHash(blockHash, 'block hash')
	const block = assertEnvelope(
		'block',
		zcashdBlock,
		await core.getBlock({
			blockHash,
		})
	)
	if (block.hash.toLowerCase() !== blockHash.toLowerCase())
		throw new Error(`${Source.Zcashd_JsonRpc}: block hash does not match request`)
	assertSafeUnsignedInteger(block.height, 'block height')
	assertSafeUnsignedInteger(block.nTx, 'block transaction count')
	return block
}

export const getRawTransaction = async ({
	txId,
}: {
	txId: string
}) => {
	assertHash(txId, 'transaction id')
	const transaction = assertEnvelope(
		'transaction',
		zcashdTransaction,
		await core.getRawTransaction({
			txId,
		})
	)
	if (transaction.txid.toLowerCase() !== txId.toLowerCase())
		throw new Error(`${Source.Zcashd_JsonRpc}: transaction id does not match request`)
	return transaction
}

export const getBlockHash = async ({
	height,
}: {
	height: bigint
}) => {
	if (height < 0n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error(`${Source.Zcashd_JsonRpc}: block height exceeds lossless JSON integer range`)
	const hash = assertEnvelope(
		'block hash',
		zcashdBlockHash,
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
		zcashdBlockCount,
		await jsonRpc2<unknown>(binding, 'getblockcount', [])
	)
)

export const getMempoolInfo = async () => (
	assertEnvelope(
		'mempool info',
		zcashdMempoolInfo,
		await core.getMempoolInfo()
	)
)

export const getTreeState = async ({
	block,
}: {
	block: string | number
}) => {
	if (typeof block === 'string')
		assertHash(block, 'tree-state block hash')
	else
		assertSafeUnsignedInteger(block, 'tree-state block height')

	const treeState = assertEnvelope(
		'tree state',
		zcashdTreeState,
		await jsonRpc2<unknown>(
			binding,
			'z_gettreestate',
			[block]
		)
	)
	assertSafeUnsignedInteger(treeState.height, 'tree-state height')
	assertHash(treeState.hash, 'tree-state block hash')
	return treeState
}

export const getTransparentAddressUtxos = async ({
	address,
	maxResults,
}: {
	address: string
	maxResults: number
}) => {
	assertTransparentAddress(address)
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error(`${Source.Zcashd_JsonRpc}: UTXO result limit must be an integer from 0 through 10000`)
	if (maxResults === 0)
		return {
			unspents: [] as (ZcashdScanTxOutSet['unspents'][number] & {
				valueSatoshis: bigint
			})[],
			totalAmountSatoshis: 0n,
		}

	const validatedAddress = assertEnvelope(
		'validated address',
		zcashdValidatedAddress,
		await jsonRpc2<unknown>(
			binding,
			'validateaddress',
			[address]
		)
	)
	if (!validatedAddress.isvalid || validatedAddress.address !== address)
		throw new Error(`${Source.Zcashd_JsonRpc}: node rejected or canonicalized the address identity`)

	const result = assertEnvelope(
		'scantxoutset',
		zcashdScanTxOutSet,
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
		throw new Error(`${Source.Zcashd_JsonRpc}: UTXO scan did not complete`)
	if (result.unspents.length > maxResults)
		throw new Error(`${Source.Zcashd_JsonRpc}: UTXO response exceeds requested result limit`)

	const outpoints = new Set<string>()
	for (const utxo of result.unspents) {
		assertHash(utxo.txid, 'UTXO transaction ID')
		assertSafeUnsignedInteger(utxo.vout, 'UTXO output index')
		assertSafeUnsignedInteger(utxo.height, 'UTXO block height')
		if (!/^(?:[0-9a-f]{2})*$/i.test(utxo.scriptPubKey))
			throw new Error(`${Source.Zcashd_JsonRpc}: invalid UTXO script`)
		satoshisFromZec(utxo.amount, 'UTXO ZEC amount')
		const outpoint = `${utxo.txid}:${utxo.vout}`
		if (outpoints.has(outpoint))
			throw new Error(`${Source.Zcashd_JsonRpc}: duplicate UTXO outpoint`)
		outpoints.add(outpoint)
	}

	return {
		unspents: result.unspents.map((utxo) => ({
			...utxo,
			valueSatoshis: satoshisFromZec(utxo.amount, 'UTXO ZEC amount'),
		})),
		totalAmountSatoshis: satoshisFromZec(result.total_amount, 'total ZEC amount'),
	}
}
