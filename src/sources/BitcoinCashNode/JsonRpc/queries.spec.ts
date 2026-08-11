import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/BitcoinCashNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { jsonRpc2 } = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBlock,
	getBlockCount,
	getRawTransaction,
	getTransparentAddressUtxos,
} = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')

const binding = bindings[Source.BitcoinCashNode_JsonRpc][0]
const blockHash = 'a'.repeat(64)
const txId = 'b'.repeat(64)
const address = `bitcoincash:q${'q'.repeat(41)}`

describe('Bitcoin Cash Node JSON-RPC envelopes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('asserts verbose getblock / getrawtransaction envelopes', async () => {
		const block = {
			hash: blockHash,
			height: 850_000,
			version: 1,
			versionHex: '00000001',
			merkleroot: 'c'.repeat(64),
			time: 1_700_000_000,
			mediantime: 1_700_000_000,
			nonce: 1,
			bits: '1a00ffff',
			difficulty: 1,
			chainwork: '01',
			nTx: 1,
			tx: [txId],
		}
		jsonRpc2.mockResolvedValueOnce(block)
		await expect(getBlock({
			blockHash,
		})).resolves.toEqual(block)

		jsonRpc2.mockResolvedValueOnce({
			hash: blockHash,
		})
		await expect(getBlock({
			blockHash,
		})).rejects.toThrow('invalid block response envelope')

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
				value: 1,
				n: 0,
				scriptPubKey: {
					asm: 'OP_DUP',
					hex: '76',
					type: 'pubkeyhash',
					address,
				},
				tokenData: {
					category: 'd'.repeat(64),
					amount: '1',
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

	it('asserts getblockcount and address scan envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(850_000)
		await expect(getBlockCount()).resolves.toBe(850_000)

		jsonRpc2.mockResolvedValueOnce(-1)
		await expect(getBlockCount()).rejects.toThrow('invalid block count response envelope')

		jsonRpc2.mockResolvedValueOnce(Number.MAX_SAFE_INTEGER + 1)
		await expect(getBlockCount()).rejects.toThrow('block count exceeds lossless JSON integer range')

		jsonRpc2.mockReset()
		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: true,
			unspents: [{
				txid: txId,
				vout: 0,
				scriptPubKey: '76a91400',
				amount: 1.5,
				height: 1,
				tokenData: {
					category: 'not-a-hash',
					amount: '1',
				},
			}],
			total_amount: 1.5,
		})
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 1,
		})).rejects.toThrow('invalid CashToken category')
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			2,
			binding,
			'scantxoutset',
			[
				'start',
				[`addr(${address})`],
			]
		)
	})
})
