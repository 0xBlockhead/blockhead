import { beforeEach, describe, expect, it, vi } from 'vitest'

import litecoinCoreBindings from '$/sources/LitecoinCore/bindings.ts'
import type { LitecoinCoreBlock } from '$/sources/LitecoinCore/JsonRpc/types.ts'
import { expectJsonRpc2Call, resetJsonRpc2Mock } from '$/sources/_shared/test/jsonRpc2.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.fn()

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBlock: getLitecoinBlock,
	getBlockCount,
	getBlockHash,
	getRawTransaction,
	getTransparentAddressUtxos,
} = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')

const litecoinMainnetBinding = litecoinCoreBindings[Source.LitecoinCore_JsonRpc][0]

const blockHash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)
const txId = 'c'.repeat(64)

const block = {
	hash: blockHash,
	height: 2_700_000,
	version: 1,
	versionHex: '00000001',
	merkleroot: 'd'.repeat(64),
	time: 1_750_000_000,
	mediantime: 1_750_000_000,
	nonce: 1,
	bits: '1a00ffff',
	difficulty: 1,
	chainwork: '01',
	nTx: 1,
	previousblockhash: parentHash,
	tx: [txId],
} satisfies LitecoinCoreBlock

describe('Litecoin Core JSON-RPC', () => {
	beforeEach(() => {
		resetJsonRpc2Mock(jsonRpc2)
	})

	it('asserts verbose getblock envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(block)

		await expect(getLitecoinBlock({
			blockHash,
		})).resolves.toEqual(block)
		expectJsonRpc2Call(jsonRpc2, litecoinMainnetBinding, 'getblock', [blockHash, 2])
	})

	it('fails closed on malformed block envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce({
			hash: blockHash,
		})
		await expect(getLitecoinBlock({
			blockHash,
		})).rejects.toThrow('invalid block response envelope')
	})

	it('asserts getrawtransaction envelopes', async () => {
		const transaction = {
			txid: txId,
			hash: txId,
			version: 1,
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
					address: 'LExampleAddress0123456789ABCDEF',
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

	it('loads tip height and height→hash mappings with fail-closed envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(2_700_000)
		await expect(getBlockCount()).resolves.toBe(2_700_000)

		jsonRpc2.mockResolvedValueOnce(-1)
		await expect(getBlockCount()).rejects.toThrow('invalid block count response envelope')

		jsonRpc2.mockResolvedValueOnce(blockHash)
		await expect(getBlockHash({
			height: 2_700_000n,
		})).resolves.toBe(blockHash)

		jsonRpc2.mockResolvedValueOnce('not-a-hash')
		await expect(getBlockHash({
			height: 1n,
		})).rejects.toThrow('invalid block hash')
	})

	it('scans transparent address UTXOs with fail-closed validation', async () => {
		const address = 'LExampleAddress0123456789ABCDEF'
		jsonRpc2.mockResolvedValueOnce({
			isvalid: true,
			address,
		})
		jsonRpc2.mockResolvedValueOnce({
			success: true,
			unspents: [{
				txid: txId,
				vout: 1,
				scriptPubKey: '76a91400',
				amount: 12.3456789,
				height: 2_700_000,
			}],
			total_amount: 12.3456789,
		})

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 25,
		})).resolves.toMatchObject({
			unspents: [{
				valueSatoshis: 1_234_567_890n,
			}],
			totalAmountSatoshis: 1_234_567_890n,
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			2,
			litecoinMainnetBinding,
			'scantxoutset',
			[
				'start',
				[`addr(${address})`],
			]
		)
	})

	it('fails closed on incomplete address scans and zero-cardinality short-circuits', async () => {
		const address = 'LExampleAddress0123456789ABCDEF'
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
