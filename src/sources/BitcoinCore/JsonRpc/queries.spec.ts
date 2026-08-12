import { beforeEach, describe, expect, it, vi } from 'vitest'

import bitcoinCoreBindings from '$/sources/BitcoinCore/bindings.ts'
import type { BitcoinCoreBlock } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.fn()

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBlock,
	getBlockCount,
	getBlockHash,
	getMempoolInfo,
	getMempoolTransactionIds,
	getRawTransaction,
	getTransparentAddressUtxos,
} = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')

const bitcoinMainnetBinding = bitcoinCoreBindings[Source.BitcoinCore_JsonRpc][0]

const blockHash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)
const txId = 'c'.repeat(64)
const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'

const block = {
	hash: blockHash,
	height: 840_000,
	version: 1,
	versionHex: '00000001',
	merkleroot: 'd'.repeat(64),
	time: 1_700_000_000,
	mediantime: 1_700_000_000,
	nonce: 1,
	bits: '1a00ffff',
	difficulty: 1,
	chainwork: '01',
	nTx: 1,
	previousblockhash: parentHash,
	tx: [txId],
} satisfies BitcoinCoreBlock

describe('Bitcoin Core JSON-RPC', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
	})

	it('asserts verbose getblock envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(block)

		await expect(getBlock({
			blockHash,
		})).resolves.toEqual(block)
		expect(jsonRpc2).toHaveBeenCalledWith(
			bitcoinMainnetBinding,
			'getblock',
			[
				blockHash,
				2,
			]
		)
	})

	it('fails closed on malformed block envelopes and hash mismatch', async () => {
		jsonRpc2.mockResolvedValueOnce({
			hash: blockHash,
		})
		await expect(getBlock({
			blockHash,
		})).rejects.toThrow('invalid block response envelope')

		jsonRpc2.mockResolvedValueOnce({
			...block,
			hash: 'e'.repeat(64),
		})
		await expect(getBlock({
			blockHash,
		})).rejects.toThrow('block hash does not match request')
	})

	it('asserts getrawtransaction envelopes', async () => {
		const transaction = {
			txid: txId,
			hash: txId,
			version: 2,
			size: 100,
			vsize: 100,
			weight: 400,
			locktime: 0,
			vin: [],
			vout: [{
				value: 0.00005,
				n: 0,
				scriptPubKey: {
					asm: 'OP_0',
					hex: '0014',
					type: 'witness_v0_keyhash',
					address,
				},
			}],
		}
		jsonRpc2.mockResolvedValueOnce(transaction)
		await expect(getRawTransaction({
			txId,
		})).resolves.toEqual(transaction)

		jsonRpc2.mockResolvedValueOnce({
			txid: txId,
		})
		await expect(getRawTransaction({
			txId,
		})).rejects.toThrow('invalid transaction response envelope')
	})

	it('rejects transaction rows that cannot safely become UTXO input and output identities', async () => {
		const transaction = {
			txid: txId,
			hash: txId,
			version: 2,
			size: 100,
			vsize: 100,
			weight: 400,
			locktime: 0,
			vin: [{
				txid: parentHash,
				vout: 0,
				sequence: 0,
			}],
			vout: [{
				value: 0.00005,
				n: 0,
				scriptPubKey: {
					asm: 'OP_0',
					hex: '0014',
					type: 'witness_v0_keyhash',
				},
			}],
		}

		jsonRpc2.mockResolvedValueOnce({
			...transaction,
			vin: [
				transaction.vin[0],
				transaction.vin[0],
			],
		})
		await expect(getRawTransaction({
			txId,
		})).rejects.toThrow('duplicate input outpoints')

		jsonRpc2.mockResolvedValueOnce({
			...transaction,
			vout: [{
				...transaction.vout[0],
				n: 1,
			}],
		})
		await expect(getRawTransaction({
			txId,
		})).rejects.toThrow('output index does not match its position')

		jsonRpc2.mockResolvedValueOnce({
			...transaction,
			vout: [{
				...transaction.vout[0],
				value: 0.000000001,
			}],
		})
		await expect(getRawTransaction({
			txId,
		})).rejects.toThrow('invalid or lossy transaction output BTC amount')
	})

	it('loads tip height, height→hash, and mempool info with fail-closed envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(840_000)
		await expect(getBlockCount()).resolves.toBe(840_000)

		jsonRpc2.mockResolvedValueOnce(-1)
		await expect(getBlockCount()).rejects.toThrow('invalid block count response envelope')

		jsonRpc2.mockResolvedValueOnce(blockHash)
		await expect(getBlockHash({
			height: 840_000n,
		})).resolves.toBe(blockHash)

		jsonRpc2.mockResolvedValueOnce('not-a-hash')
		await expect(getBlockHash({
			height: 1n,
		})).rejects.toThrow('invalid block hash')

		jsonRpc2.mockResolvedValueOnce(Number.MAX_SAFE_INTEGER + 1)
		await expect(getBlockCount()).rejects.toThrow('block count exceeds lossless JSON integer range')

		const mempoolInfo = {
			loaded: true,
			size: 1,
			bytes: 2,
			usage: 3,
			total_fee: 0.001,
			maxmempool: 300_000_000,
			mempoolminfee: 0.00001,
			minrelaytxfee: 0.00001,
		}
		jsonRpc2.mockResolvedValueOnce(mempoolInfo)
		await expect(getMempoolInfo()).resolves.toEqual(mempoolInfo)

		jsonRpc2.mockResolvedValueOnce({
			loaded: true,
		})
		await expect(getMempoolInfo()).rejects.toThrow('invalid mempool info response envelope')
	})

	it('loads a unique fail-closed direct-node mempool identity set', async () => {
		jsonRpc2.mockResolvedValueOnce([
			txId,
			blockHash,
		])
		await expect(getMempoolTransactionIds()).resolves.toEqual([
			txId,
			blockHash,
		])
		expect(jsonRpc2).toHaveBeenCalledWith(
			bitcoinMainnetBinding,
			'getrawmempool',
			[false]
		)

		jsonRpc2.mockResolvedValueOnce([txId, txId])
		await expect(getMempoolTransactionIds()).rejects.toThrow('duplicate mempool transaction ID')

		jsonRpc2.mockResolvedValueOnce(['not-a-transaction-id'])
		await expect(getMempoolTransactionIds()).rejects.toThrow('invalid mempool transaction ID')
	})

	it('scans transparent address UTXOs with fail-closed validation', async () => {
		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: true,
			unspents: [{
				txid: txId,
				vout: 1,
				scriptPubKey: '001400',
				amount: 0.01234567,
				height: 840_000,
			}],
			total_amount: 0.01234567,
		})

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 25,
		})).resolves.toMatchObject({
			unspents: [{
				valueSatoshis: 1_234_567n,
			}],
			totalAmountSatoshis: 1_234_567n,
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			2,
			bitcoinMainnetBinding,
			'scantxoutset',
			[
				'start',
				[`addr(${address})`],
			]
		)
	})

	it('fails closed on incomplete address scans and zero-cardinality short-circuits', async () => {
		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: false,
			unspents: [],
			total_amount: 0,
		})
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 1,
		})).rejects.toThrow('did not complete')

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 0,
		})).resolves.toMatchObject({
			unspents: [],
			totalAmountSatoshis: 0n,
		})
		expect(jsonRpc2).toHaveBeenCalledTimes(2)
	})
})
