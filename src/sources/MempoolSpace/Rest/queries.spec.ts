import { beforeEach, describe, expect, it, vi } from 'vitest'

import lightningBindings from '$/sources/LightningMempoolSpace/bindings.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
}))

const {
	getBlock,
	getBlockHashByHeight,
	getBlockTransactionIds,
	getBlocks,
	getAddress,
	getAddressTransactions,
	getAddressUtxos,
	getMempoolStats,
	getRecommendedFees,
	getTransaction,
	getTransactionProtocolPayloads,
} = await import('$/sources/MempoolSpace/Rest/queries.ts')

const binding = bindings[Source.MempoolSpace_Rest][0]

const validBlock = {
	id: 'a'.repeat(64),
	height: 840_000,
	timestamp: 1_700_000_000,
	tx_count: 1,
}

describe('mempool.space Bitcoin REST binding', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('preserves the Bitcoin API prefix and does not recover binding identity from the shared origin', async () => {
		sourceGetJson
			.mockResolvedValueOnce(validBlock)
			.mockResolvedValueOnce({
				fastestFee: 20,
				halfHourFee: 10,
				hourFee: 5,
				economyFee: 2,
				minimumFee: 1,
			})

		await getBlock('a'.repeat(64))
		await getRecommendedFees()

		expect(binding).not.toBe(
			lightningBindings[Source.LightningMempoolSpace_Rest][0]
		)
		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				`https://mempool.space/api/block/${'a'.repeat(64)}`,
			],
			[
				binding,
				'https://mempool.space/api/v1/fees/recommended',
			],
		])
	})

	it('resolves block hash by height and address UTXOs on hard-fail paths', async () => {
		sourceGetJson
			.mockResolvedValueOnce('a'.repeat(64))
			.mockResolvedValueOnce([
				{
					txid: 'b'.repeat(64),
					vout: 1,
					status: {
						confirmed: true,
					},
					value: 1000,
				},
			])

		await expect(getBlockHashByHeight(840_000n)).resolves.toBe('a'.repeat(64))
		await expect(getAddressUtxos('bc1qexample')).resolves.toHaveLength(1)

		expect(sourceGetJson.mock.calls).toEqual([
			[
				binding,
				'https://mempool.space/api/block-height/840000',
			],
			[
				binding,
				'https://mempool.space/api/address/bc1qexample/utxo',
			],
		])
	})

	it('rejects invalid or substituted block, transaction, and address identities before returning provider rows', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...validBlock,
			id: 'b'.repeat(64),
		})
		await expect(getBlock('a'.repeat(64))).rejects.toThrow('block response has mismatched identity')

		sourceGetJson.mockResolvedValueOnce({
			txid: 'b'.repeat(64),
			status: { confirmed: false },
			vin: [],
			vout: [],
		})
		await expect(getTransaction('a'.repeat(64))).rejects.toThrow('transaction response has mismatched identity')

		sourceGetJson.mockResolvedValueOnce({
			address: 'bc1qother',
			chain_stats: {
				funded_txo_count: 0,
				funded_txo_sum: 0,
				spent_txo_count: 0,
				spent_txo_sum: 0,
				tx_count: 0,
			},
			mempool_stats: {
				funded_txo_count: 0,
				funded_txo_sum: 0,
				spent_txo_count: 0,
				spent_txo_sum: 0,
				tx_count: 0,
			},
		})
		await expect(getAddress('bc1qrequested')).rejects.toThrow('address response has mismatched identity')

		sourceGetJson.mockReset()
		for (const query of [
			() => getBlock('not-a-hash'),
			() => getBlockTransactionIds('not-a-hash'),
			() => getTransaction('not-a-transaction'),
			() => getBlockHashByHeight(-1n),
			() => getBlocks(-1n),
			() => getAddress(''),
			() => getAddressUtxos(''),
			() => getAddressTransactions('bc1qrequested', 'not-a-transaction'),
		])
			await expect(query()).rejects.toThrow('MempoolSpace_Rest:')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('fail-closes malformed mempool stats and recommended fee envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			count: -1,
			vsize: 1,
			total_fee: 1,
		})
		await expect(getMempoolStats()).rejects.toThrow('invalid mempool stats envelope')

		sourceGetJson.mockResolvedValueOnce({
			fastestFee: 1,
			halfHourFee: 1,
			hourFee: Number.MAX_SAFE_INTEGER + 1,
			economyFee: 1,
			minimumFee: 1,
		})
		await expect(getRecommendedFees()).rejects.toThrow('invalid recommended fees envelope')
	})

	it('getTransactionProtocolPayloads extracts Runestone from the Esplora-compatible tx wire', async () => {
		const txId = 'cc'.repeat(32)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			vin: [],
			vout: [
				{
					scriptpubkey: '6a5d51',
					scriptpubkey_asm: '',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
			status: {
				confirmed: false,
			},
		})

		await expect(
			getTransactionProtocolPayloads(txId)
		).resolves.toEqual([
			{
				protocol: 'Runes',
				transactionId: txId,
				location: {
					outputIndex: 0,
				},
				payloadHex: '',
				isCenotaph: true,
			},
		])
	})

	it('getTransactionProtocolPayloads extracts multi-envelope Ordinals and valid Runestone payloads', async () => {
		const txId = 'dd'.repeat(32)
		const helloWorldInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '18746578742f706c61696e3b636861727365743d7574662d38'
			+ '00'
			+ '0d48656c6c6f2c20776f726c6421'
			+ '68'
		)
		const secondInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '0a746578742f706c61696e'
			+ '00'
			+ '024869'
			+ '68'
		)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 800,
			vin: [
				{
					txid: 'ee'.repeat(32),
					vout: 0,
					is_coinbase: false,
					sequence: 0xffffffff,
					witness: [
						helloWorldInscriptionHex + secondInscriptionHex,
					],
				},
			],
			vout: [
				{
					scriptpubkey: '6a5d03020100',
					scriptpubkey_asm: '',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
			status: {
				confirmed: true,
			},
		})

		const payloads = await getTransactionProtocolPayloads(txId)
		expect(payloads.filter((payload) => payload.protocol === 'Ordinals')).toHaveLength(2)
		expect(payloads.find((payload) => payload.protocol === 'Runes')).toMatchObject({
			payloadHex: '020100',
			isCenotaph: false,
		})
	})
})
