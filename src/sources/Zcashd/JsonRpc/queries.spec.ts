import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Zcashd/bindings.ts'
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
	getTransparentAddressUtxos,
	getTreeState,
} = await import('$/sources/Zcashd/JsonRpc/queries.ts')

const zcashdMainnetBinding = bindings[Source.Zcashd_JsonRpc][0]

const blockHash = 'a'.repeat(64)
const parentHash = 'b'.repeat(64)
const txId = 'c'.repeat(64)

const block = {
	hash: blockHash,
	height: 2_800_000,
	version: 4,
	versionHex: '00000004',
	merkleroot: 'd'.repeat(64),
	time: 1_750_000_000,
	mediantime: 1_750_000_000,
	nonce: 1,
	bits: '1a00ffff',
	difficulty: 1,
	chainwork: '01',
	nTx: 1,
	previousblockhash: parentHash,
	finalsaplingroot: 'e'.repeat(64),
	tx: [txId],
}

describe('Zcashd JSON-RPC queries', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
	})

	it('asserts verbose getblock envelopes and preserves Sapling tip root', async () => {
		jsonRpc2.mockResolvedValueOnce(block)
		await expect(getBlock({
			blockHash,
		})).resolves.toEqual(block)
		expect(jsonRpc2).toHaveBeenCalledWith(
			zcashdMainnetBinding,
			'getblock',
			[
				blockHash,
				2,
			]
		)
	})

	it('fails closed on malformed block envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce({
			hash: blockHash,
		})
		await expect(getBlock({
			blockHash,
		})).rejects.toThrow('invalid block response envelope')
	})

	it('accepts the Zcash transaction wire without Bitcoin weight', async () => {
		const transaction = {
			txid: txId,
			hash: txId,
			version: 5,
			overwintered: true,
			versiongroupid: '26a7270a',
			locktime: 0,
			expiryheight: 2_800_040,
			size: 1_024,
			vin: [],
			vout: [],
			vShieldedSpend: [{
				cv: 'value-commitment',
				anchor: 'anchor',
				nullifier: 'nullifier',
				rk: 'randomized-key',
				proof: 'spend-proof',
				spendAuthSig: 'spend-auth-signature',
			}],
			vShieldedOutput: [],
		}
		jsonRpc2.mockResolvedValueOnce(transaction)
		await expect(getRawTransaction({
			txId,
		})).resolves.toMatchObject({
			expiryheight: 2_800_040,
			vShieldedSpend: [{
				proof: 'spend-proof',
			}],
		})
		expect(jsonRpc2).toHaveBeenCalledWith(
			zcashdMainnetBinding,
			'getrawtransaction',
			[
				txId,
				1,
			]
		)
	})

	it('loads tip height, height→hash, and mempool envelopes', async () => {
		jsonRpc2.mockResolvedValueOnce(2_800_000)
		await expect(getBlockCount()).resolves.toBe(2_800_000)

		jsonRpc2.mockResolvedValueOnce(-1)
		await expect(getBlockCount()).rejects.toThrow('invalid block count response envelope')

		jsonRpc2.mockResolvedValueOnce(blockHash)
		await expect(getBlockHash({
			height: 2_800_000n,
		})).resolves.toBe(blockHash)

		jsonRpc2.mockResolvedValueOnce({
			loaded: true,
			size: 7,
			bytes: 9_001,
			usage: 10_000,
			total_fee: 0.01,
			maxmempool: 300_000_000,
			mempoolminfee: 0.00001,
			minrelaytxfee: 0.00001,
		})
		await expect(getMempoolInfo()).resolves.toMatchObject({
			size: 7,
			bytes: 9_001,
		})
	})

	it('requests and preserves exact-block Sapling and Orchard commitment trees', async () => {
		jsonRpc2.mockResolvedValueOnce({
			hash: blockHash,
			height: 2_800_000,
			time: 1_750_000_000,
			sapling: {
				skipHash: 'sapling-skip',
				commitments: {
					finalRoot: 'sapling-root',
					finalState: 'sapling-state',
				},
			},
			orchard: {
				skipHash: 'orchard-skip',
				commitments: {
					finalRoot: 'orchard-root',
					finalState: 'orchard-state',
				},
			},
		})

		await expect(getTreeState({
			block: 2_800_000,
		})).resolves.toMatchObject({
			height: 2_800_000,
			sapling: {
				commitments: {
					finalRoot: 'sapling-root',
					finalState: 'sapling-state',
				},
			},
			orchard: {
				commitments: {
					finalRoot: 'orchard-root',
					finalState: 'orchard-state',
				},
			},
		})
		expect(jsonRpc2).toHaveBeenCalledWith(
			zcashdMainnetBinding,
			'z_gettreestate',
			[2_800_000]
		)
	})

	it('scans transparent address UTXOs via validateaddress + scantxoutset', async () => {
		const address = `t1${'A'.repeat(33)}`
		jsonRpc2
			.mockResolvedValueOnce({
				isvalid: true,
				address,
			})
			.mockResolvedValueOnce({
				success: true,
				unspents: [{
					txid: txId,
					vout: 1,
					scriptPubKey: '76a91400',
					amount: 1.5,
					height: 2_800_000,
				}],
				total_amount: 1.5,
			})

		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 25,
		})).resolves.toMatchObject({
			totalAmountSatoshis: 150_000_000n,
			unspents: [{
				valueSatoshis: 150_000_000n,
			}],
		})
	})

	it('fails closed on foreign or oversized transparent UTXO scans', async () => {
		const address = `t1${'A'.repeat(33)}`
		jsonRpc2
			.mockResolvedValueOnce({
				isvalid: true,
				address: `t1${'B'.repeat(33)}`,
			})
		await expect(getTransparentAddressUtxos({
			address,
			maxResults: 1,
		})).rejects.toThrow('node rejected or canonicalized the address identity')
	})
})
