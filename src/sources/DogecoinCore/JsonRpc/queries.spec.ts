import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/BitcoinCore/bindings.ts'
import dogecoinCoreBindings from '$/sources/DogecoinCore/bindings.ts'
import type { DogecoinCoreBlock } from '$/sources/DogecoinCore/JsonRpc/types.ts'
import litecoinCoreBindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.fn()

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getBlock: getBitcoinBlock,
	getRawTransaction: getBitcoinRawTransaction,
} = await import('$/sources/BitcoinCore/JsonRpc/queries.ts')
const {
	getBlock: getDogecoinBlock,
} = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
const {
	getBlock: getLitecoinBlock,
	getRawTransaction: getLitecoinRawTransaction,
} = await import('$/sources/LitecoinCore/JsonRpc/queries.ts')

const bitcoinMainnetBinding = bindings[Source.BitcoinCore_JsonRpc][0]
const dogecoinMainnetBinding = dogecoinCoreBindings[Source.DogecoinCore_JsonRpc][0]
const litecoinMainnetBinding = litecoinCoreBindings[Source.LitecoinCore_JsonRpc][0]

const block = {
	hash: 'dogecoin-block-hash',
	height: 5_000_000,
	version: 1,
	versionHex: '00000001',
	merkleroot: 'block-merkle-root',
	time: 1_750_000_000,
	mediantime: 1_750_000_000,
	nonce: 1,
	bits: '1a00ffff',
	difficulty: 1,
	chainwork: '01',
	nTx: 1,
	tx: [],
	auxpow: {
		tx: {
			txid: 'coinbase-transaction',
			hash: 'coinbase-transaction',
			version: 1,
			size: 1,
			vsize: 1,
			weight: 4,
			locktime: 0,
			vin: [],
			vout: [],
		},
		index: 0,
		chainindex: 1,
		merklebranch: [
			'coinbase-branch',
		],
		chainmerklebranch: [
			'chain-branch',
		],
		parentblock: '00'.repeat(80),
	},
} satisfies DogecoinCoreBlock

describe('Dogecoin Core JSON-RPC', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
	})

	it('preserves the typed AuxPoW extension from verbose getblock', async () => {
		jsonRpc2.mockResolvedValueOnce(block)

		await expect(getDogecoinBlock({
			blockHash: block.hash,
		})).resolves.toEqual(block)
		expect(jsonRpc2).toHaveBeenCalledWith(
			dogecoinMainnetBinding,
			'getblock',
			[
				block.hash,
				2,
			]
		)
	})

	it('fails closed on a JSON-RPC error', async () => {
		jsonRpc2.mockRejectedValueOnce(new Error('JSON-RPC getblock: Block not found'))

		await expect(getDogecoinBlock({
			blockHash: 'missing',
		})).rejects.toThrow('Block not found')
	})

	it('keeps each protocol family request attached to its canonical binding', async () => {
		jsonRpc2.mockResolvedValue(block)

		await getBitcoinBlock({
			blockHash: block.hash,
		})
		await getDogecoinBlock({
			blockHash: block.hash,
		})
		await getLitecoinBlock({
			blockHash: block.hash,
		})

		expect(jsonRpc2.mock.calls.map((call) => call[0])).toEqual([
			bitcoinMainnetBinding,
			dogecoinMainnetBinding,
			litecoinMainnetBinding,
		])
	})

	it('preserves explicit block and transaction verbosity', async () => {
		jsonRpc2.mockResolvedValue('wire-result')

		await getBitcoinBlock({
			blockHash: block.hash,
			verbosity: 0,
		})
		await getBitcoinRawTransaction({
			txId: 'bitcoin-transaction',
		})
		await getLitecoinRawTransaction({
			txId: 'litecoin-transaction',
			verbose: false,
		})

		expect(jsonRpc2.mock.calls.map((call) => call.slice(1))).toEqual([
			[
				'getblock',
				[
					block.hash,
					0,
				],
			],
			[
				'getrawtransaction',
				[
					'bitcoin-transaction',
					true,
				],
			],
			[
				'getrawtransaction',
				[
					'litecoin-transaction',
					false,
				],
			],
		])
	})
})
