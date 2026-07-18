import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DogecoinCoreBlock } from '$/sources/DogecoinCore/JsonRpc/types.ts'

const corsFetch = vi.fn()

vi.mock('$/lib/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	corsFetch,
}))

const { getBlock } = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')

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
		corsFetch.mockReset()
	})

	it('preserves the typed AuxPoW extension from verbose getblock', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: block,
		})))

		await expect(getBlock({
			rpcUrl: 'https://dogecoin.example',
			blockHash: block.hash,
		})).resolves.toEqual(block)
		expect(JSON.parse(corsFetch.mock.calls[0][1].init.body)).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'getblock',
			params: [
				block.hash,
				2,
			],
		})
	})

	it('fails closed on a JSON-RPC error', async () => {
		corsFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -5,
				message: 'Block not found',
			},
		})))

		await expect(getBlock({
			rpcUrl: 'https://dogecoin.example',
			blockHash: 'missing',
		})).rejects.toThrow('Block not found')
	})
})
