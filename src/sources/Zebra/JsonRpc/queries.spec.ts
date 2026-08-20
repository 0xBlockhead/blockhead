import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Zebra/bindings.ts'
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
	getRawTransaction,
	getTransparentAddressTransactionIds,
	getTransparentAddressUtxos,
} = await import('$/sources/Zebra/JsonRpc/queries.ts')

const binding = bindings[Source.Zebra_JsonRpc][0]

const address = `t1${'A'.repeat(33)}`
const blockHash = 'a'.repeat(64)
const txId = 'b'.repeat(64)

describe('Zebra transparent-address transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('asserts block and transaction envelopes through neutral JSON-RPC reads', async () => {
		jsonRpc2
			.mockResolvedValueOnce({
				hash: blockHash,
				height: 2_800_000,
				version: 4,
				versionHex: '00000004',
				merkleroot: 'c'.repeat(64),
				time: 1_750_000_000,
				mediantime: 1_750_000_000,
				nonce: 1,
				bits: '1a00ffff',
				difficulty: 1,
				chainwork: '01',
				nTx: 1,
				tx: [txId],
			})
			.mockResolvedValueOnce({
				txid: txId,
				hash: txId,
				version: 5,
				locktime: 0,
				expiryheight: 2_800_040,
				size: 200,
				vsize: 200,
				weight: 800,
				vin: [],
				vout: [],
			})

		await getBlock({
			blockHash,
		})
		await getRawTransaction({
			txId,
		})

		expect(jsonRpc2.mock.calls).toEqual([
			[
				binding,
				'getblock',
				[
					blockHash,
					2,
				],
			],
			[
				binding,
				'getrawtransaction',
				[
					txId,
					true,
				],
			],
		])
	})

	it('loads tip height, height→hash, and mempool envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(2_800_000)
		await expect(getBlockCount()).resolves.toBe(2_800_000)

		jsonRpc2.mockResolvedValueOnce(blockHash)
		await expect(getBlockHash({
			height: 2_800_000n,
		})).resolves.toBe(blockHash)

		jsonRpc2.mockResolvedValueOnce({
			loaded: true,
			size: 11,
			bytes: 4_002,
			usage: 5_000,
			total_fee: 0.02,
			maxmempool: 300_000_000,
			mempoolminfee: 0.00001,
			minrelaytxfee: 0.00001,
		})
		await expect(getMempoolInfo()).resolves.toMatchObject({
			size: 11,
			bytes: 4_002,
		})
	})

	it('loads bounded, account-owned UTXOs with exact zatoshi integers', async () => {
		jsonRpc2.mockResolvedValueOnce({
			utxos: [{
				address,
				txid: 'a'.repeat(64),
				height: 2_800_000,
				outputIndex: 1,
				script: '76a91400',
				satoshis: 2_100_000_000_000_000,
			}],
			hash: 'b'.repeat(64),
			height: 2_800_001,
		})

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 25,
		})).resolves.toMatchObject({
			utxos: [{
				satoshis: 2_100_000_000_000_000,
			}],
		})
		expect(jsonRpc2).toHaveBeenCalledWith(
			binding,
			'getaddressutxos',
			[{
				addresses: [address],
				chainInfo: true,
			}]
		)
	})

	it('bounds transaction history by an exact inclusive block window', async () => {
		jsonRpc2.mockResolvedValueOnce([
			'c'.repeat(64),
			'd'.repeat(64),
		])

		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 2_790_000,
			endHeight: 2_799_999,
			maxResults: 25,
		})).resolves.toHaveLength(2)
		expect(jsonRpc2).toHaveBeenCalledWith(
			binding,
			'getaddresstxids',
			[{
				addresses: [address],
				start: 2_790_000,
				end: 2_799_999,
			}]
		)
	})

	it('rejects foreign, duplicate, lossy, malformed, and oversized results', async () => {
		jsonRpc2.mockResolvedValueOnce({
			utxos: [{
				address: `t3${'B'.repeat(33)}`,
				txid: 'a'.repeat(64),
				height: 1,
				outputIndex: 0,
				script: '',
				satoshis: 1,
			}],
			hash: 'b'.repeat(64),
			height: 1,
		})
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 1,
		})).rejects.toThrow('foreign address row')

		jsonRpc2.mockResolvedValueOnce([
			'c'.repeat(64),
			'c'.repeat(64),
		])
		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 1,
			endHeight: 2,
			maxResults: 2,
		})).rejects.toThrow('duplicate transparent transaction ID')

		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 1,
			endHeight: 10_001,
			maxResults: 1,
		})).rejects.toThrow('1 through 10000 blocks')
		expect(jsonRpc2).toHaveBeenCalledTimes(2)
	})

	it('does not transport zero-cardinality requests', async () => {
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 0,
		})).resolves.toMatchObject({
			utxos: [],
		})
		await expect(getTransparentAddressTransactionIds({
			address,
			startHeight: 1,
			endHeight: 1,
			maxResults: 0,
		})).resolves.toEqual([])
		expect(jsonRpc2).not.toHaveBeenCalled()
	})

	it('fails closed on malformed tip envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(-1)
		await expect(getBlockCount()).rejects.toThrow('invalid block count response envelope')

		jsonRpc2.mockResolvedValueOnce({
			hash: blockHash,
		})
		await expect(getBlock({
			blockHash,
		})).rejects.toThrow('invalid block response envelope')
	})
})
