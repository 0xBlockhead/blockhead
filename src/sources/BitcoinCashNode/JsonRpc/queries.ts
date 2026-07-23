import {
	getBlock as getBitcoinCoreBlock,
	getBlockHash as getBitcoinCoreBlockHash,
	getMempoolInfo as getBitcoinCoreMempoolInfo,
	getRawTransaction as getBitcoinCoreRawTransaction,
} from '$/sources/BitcoinCore/JsonRpc/queries.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	BitcoinCashScanTxOutSet,
	BitcoinCashTokenData,
	BitcoinCashTransaction,
	BitcoinCashValidatedAddress,
} from '$/sources/BitcoinCashNode/JsonRpc/types.ts'

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.BitcoinCashNode_JsonRpc
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'bip122:000000000000000000651ef99cb9fcbe'
	)
		throw new Error('BitcoinCashNode_JsonRpc: expected canonical Bitcoin Cash mainnet binding')
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
	if (!/^[0-9a-f]{64}$/.test(value))
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
	assertHash(tokenData.category, 'CashToken category')
	if (tokenData.amount != null) {
		try {
			if (BigInt(tokenData.amount) < 0n)
				throw new Error()
		} catch {
			throw new Error('BitcoinCashNode_JsonRpc: invalid CashToken fungible amount')
		}
	}
	if (tokenData.nft != null && !/^(?:[0-9a-f]{2})*$/.test(tokenData.nft.commitment))
		throw new Error('BitcoinCashNode_JsonRpc: invalid CashToken NFT commitment')
}

export const getBlockHash = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	getBitcoinCoreBlockHash({
		rpcUrl,
		height,
	})
)

export const getBlock = ({
	rpcUrl,
	blockHash,
	verbosity = 2,
}: {
	rpcUrl: string
	blockHash: string
	verbosity?: 0 | 1 | 2
}) => (
	getBitcoinCoreBlock({
		rpcUrl,
		blockHash,
		verbosity,
	})
)

export const getRawTransaction = async ({
	rpcUrl,
	txId,
}: {
	rpcUrl: string
	txId: string
}) => (
	await getBitcoinCoreRawTransaction({
		rpcUrl,
		txId,
		verbose: true,
	})
) as BitcoinCashTransaction

export const getMempoolInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	getBitcoinCoreMempoolInfo({ rpcUrl })
)

export const getTransparentAddressUtxos = async (
	binding: SourceBinding,
	{
		address,
		maxResults,
	}: {
		address: string
		maxResults: number
	}
) => {
	assertBinding(binding)
	assertCashAddress(address)
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error('BitcoinCashNode_JsonRpc: UTXO result limit must be an integer from 0 through 10000')
	if (maxResults === 0)
		return {
			unspents: [],
			totalAmountZatoshis: 0n,
			tokenTotalAmountByCategory: {},
		}

	const validatedAddress = await jsonRpc2<BitcoinCashValidatedAddress>(
		binding,
		'validateaddress',
		[address]
	)
	if (!validatedAddress.isvalid || validatedAddress.address !== address)
		throw new Error('BitcoinCashNode_JsonRpc: node rejected or canonicalized the CashAddr identity')

	const result = await jsonRpc2<BitcoinCashScanTxOutSet>(
		binding,
		'scantxoutset',
		[
			'start',
			[`addr(${address})`],
		]
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
		if (!/^(?:[0-9a-f]{2})*$/.test(utxo.scriptPubKey))
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
