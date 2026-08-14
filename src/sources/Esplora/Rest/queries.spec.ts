import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Esplora/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

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
	getAsset,
	getBlock,
	getBlocks,
	getBlockTransactionIds,
	getBlockTransactions,
	getAddress,
	getMempoolStats,
	getSuggestedFeePerByteSats,
	getTransaction,
	getTransactionProtocolPayloads,
} = await import('$/sources/Esplora/Rest/queries.ts')

const bitcoinBinding = bindings[Source.Esplora_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.Caip2Network
))
const liquidBinding = bindings[Source.Esplora_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.NetworkSlug
))
if (bitcoinBinding == null || liquidBinding == null)
	throw new Error('Esplora spec requires Bitcoin and Liquid bindings')

const validBlock = {
	id: 'a'.repeat(64),
	height: 840_000,
	timestamp: 1_700_000_000,
	tx_count: 1,
}

describe('Esplora REST binding selection', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('selects the exact target binding and preserves its API prefix', async () => {
		sourceGetJson
			.mockResolvedValueOnce(validBlock)
			.mockResolvedValueOnce(validBlock)

		await getBlock({
			blockHash: validBlock.id,
			target: bitcoinBinding.target.key,
		})
		await getBlock({
			blockHash: validBlock.id,
			target: liquidBinding.target.key,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				`https://blockstream.info/api/block/${validBlock.id}`,
			],
			[
				liquidBinding,
				`https://blockstream.info/liquid/api/block/${validBlock.id}`,
			],
		])
	})

	it('rejects substituted block and transaction identities', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				...validBlock,
				id: 'b'.repeat(64),
			})
			.mockResolvedValueOnce({
				txid: 'b'.repeat(64),
				status: {
					confirmed: false,
				},
				vin: [],
				vout: [],
			})

		await expect(getBlock({
			blockHash: validBlock.id,
			target: bitcoinBinding.target.key,
		})).rejects.toThrow('mismatched identity')
		await expect(getTransaction({
			target: bitcoinBinding.target.key,
			txId: validBlock.id,
		})).rejects.toThrow('mismatched identity')
	})

	it('accepts bounded Liquid issuance wire and rejects malformed asset identity', async () => {
		const txId = 'a'.repeat(64)
		sourceGetJson
			.mockResolvedValueOnce({
				txid: txId,
				status: {
					confirmed: true,
				},
				vin: [{
					is_coinbase: false,
					sequence: 1,
					issuance: {
						asset_id: 'b'.repeat(64),
						is_reissuance: false,
						asset_blinding_nonce: '0'.repeat(64),
						asset_entropy: 'c'.repeat(64),
						assetamount: 1,
					},
				}],
				vout: [],
			})
			.mockResolvedValueOnce({
				txid: txId,
				status: {
					confirmed: true,
				},
				vin: [{
					is_coinbase: false,
					sequence: 1,
					issuance: {
						asset_id: 'not-an-asset-id',
						is_reissuance: false,
						asset_blinding_nonce: '0'.repeat(64),
						asset_entropy: 'c'.repeat(64),
					},
				}],
				vout: [],
			})

		await expect(getTransaction({
			target: liquidBinding.target.key,
			txId,
		})).resolves.toMatchObject({
			vin: [{
				issuance: {
					asset_id: 'b'.repeat(64),
					assetamount: 1,
				},
			}],
		})
		await expect(getTransaction({
			target: liquidBinding.target.key,
			txId,
		})).rejects.toThrow('invalid transaction envelope')
	})

	it('preserves authoritative Liquid peg markers and peg-out scripts', async () => {
		sourceGetJson.mockResolvedValueOnce({
			txid: 'a'.repeat(64),
			status: { confirmed: false },
			vin: [{
				txid: 'b'.repeat(64),
				vout: 0,
				is_coinbase: false,
				is_pegin: true,
				sequence: 1,
			}],
			vout: [{
				scriptpubkey: '6a',
				scriptpubkey_type: 'op_return',
				value: 10,
				pegout: {
					genesis_hash: 'c'.repeat(64),
					scriptpubkey: '0014abcd',
				},
			}],
		})

		await expect(getTransaction({
			target: 'liquid',
			txId: 'a'.repeat(64),
		})).resolves.toMatchObject({
			vin: [{ is_pegin: true }],
			vout: [{ pegout: { scriptpubkey: '0014abcd' } }],
		})
	})

	it('accepts the genesis block null previous hash', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...validBlock,
			height: 0,
			previousblockhash: null,
		})

		await expect(getBlock({
			blockHash: validBlock.id,
			target: bitcoinBinding.target.key,
		})).resolves.toMatchObject({
			height: 0,
			previousblockhash: null,
		})
	})

	it('fail-closes malformed block and asset envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			id: 'not-a-hash',
			height: 1,
			timestamp: 1,
			tx_count: 1,
		})
		await expect(getBlock({
			blockHash: 'x',
			target: bitcoinBinding.target.key,
		})).rejects.toThrow('invalid block envelope')

		sourceGetJson.mockResolvedValueOnce({
			asset_id: 'asset',
			chain_stats: { tx_count: -1 },
			mempool_stats: { tx_count: 0 },
		})
		await expect(getAsset({
			assetId: 'asset',
			target: liquidBinding.target.key,
		})).rejects.toThrow('invalid asset envelope')
	})

	it('getTransactionProtocolPayloads extracts Ordinals + Runes from the Esplora tx wire', async () => {
		const txId = 'aa'.repeat(32)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			fee: 100,
			vin: [
				{
					txid: 'bb'.repeat(32),
					vout: 0,
					prevout: null,
					scriptsig: '',
					scriptsig_asm: '',
					witness: [
						'0063036f7264010118746578742f706c61696e3b636861727365743d7574662d38000d48656c6c6f2c20776f726c642168',
					],
					is_coinbase: false,
					sequence: 0xffffffff,
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

		const payloads = await getTransactionProtocolPayloads({
			target: bitcoinBinding.target.key,
			txId,
		})

		expect(payloads).toHaveLength(2)
		expect(payloads[0]).toMatchObject({
			protocol: 'Ordinals',
			transactionId: txId,
			contentType: 'text/plain;charset=utf-8',
		})
		expect(payloads[1]).toMatchObject({
			protocol: 'Runes',
			transactionId: txId,
			payloadHex: '020100',
			isCenotaph: false,
		})
	})

	it('getTransactionProtocolPayloads marks LEB128 Cenotaph-tag runestones', async () => {
		const txId = 'ff'.repeat(32)
		sourceGetJson.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 50,
			weight: 200,
			vin: [],
			vout: [
				{
					scriptpubkey: '6a5d037e0000',
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
			getTransactionProtocolPayloads({
				target: bitcoinBinding.target.key,
				txId,
			})
		).resolves.toEqual([
			{
				protocol: 'Runes',
				transactionId: txId,
				location: {
					outputIndex: 0,
				},
				payloadHex: '7e0000',
				isCenotaph: true,
			},
		])
	})

	it('pages full block transactions and fail-closes mismatched block identity', async () => {
		const blockHash = 'a'.repeat(64)
		const firstTransaction = {
			txid: 'bb'.repeat(32),
			version: 2,
			locktime: 0,
			size: 100,
			weight: 400,
			fee: 100,
			vin: [{
				txid: 'cc'.repeat(32),
				vout: 0,
				is_coinbase: false,
				sequence: 1,
				witness: [],
			}],
			vout: [{
				scriptpubkey: '5120',
				scriptpubkey_asm: 'OP_1',
				scriptpubkey_type: 'v1_p2tr',
				scriptpubkey_address: 'bc1qexample',
				value: 546,
			}],
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: blockHash,
			},
		}
		sourceGetJson
			.mockResolvedValueOnce([firstTransaction])
			.mockResolvedValueOnce([{
				...firstTransaction,
				txid: 'dd'.repeat(32),
				status: {
					confirmed: true,
					block_height: 840_000,
					block_hash: 'e'.repeat(64),
				},
			}])

		await expect(getBlockTransactions({
			blockHash,
			startIndex: 25,
			target: bitcoinBinding.target.key,
		})).resolves.toEqual([firstTransaction])
		await expect(getBlockTransactions({
			blockHash,
			startIndex: 0,
			target: bitcoinBinding.target.key,
		})).rejects.toThrow('mismatched block identity')
		await expect(getBlockTransactions({
			blockHash,
			startIndex: -1,
			target: bitcoinBinding.target.key,
		})).rejects.toThrow('block transaction start index must be a non-negative safe integer')

		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			`https://blockstream.info/api/block/${blockHash}/txs/25`,
			`https://blockstream.info/api/block/${blockHash}/txs/0`,
		])
	})

	it('fail-closes tip blocks, block txids, mempool stats, fee estimates, and address envelopes', async () => {
		sourceGetJson
			.mockResolvedValueOnce([validBlock])
			.mockResolvedValueOnce(['aa'.repeat(32)])
			.mockResolvedValueOnce({
				count: 12,
				vsize: 2400,
				total_fee: 50_000,
			})
			.mockResolvedValueOnce({
				'1': 20.5,
				'6': 8.25,
			})
			.mockResolvedValueOnce({
				address: 'bc1qexample',
				chain_stats: {
					funded_txo_count: 2,
					funded_txo_sum: 1000,
					spent_txo_count: 1,
					spent_txo_sum: 400,
					tx_count: 2,
				},
				mempool_stats: {
					funded_txo_count: 0,
					funded_txo_sum: 0,
					spent_txo_count: 0,
					spent_txo_sum: 0,
					tx_count: 1,
				},
			})

		await expect(getBlocks({
			target: bitcoinBinding.target.key,
		})).resolves.toEqual([validBlock])
		await expect(getBlockTransactionIds({
			blockHash: 'a'.repeat(64),
			target: bitcoinBinding.target.key,
		})).resolves.toEqual(['aa'.repeat(32)])
		await expect(getMempoolStats(bitcoinBinding.target.key)).resolves.toMatchObject({
			count: 12,
			vsize: 2400,
		})
		await expect(getSuggestedFeePerByteSats(bitcoinBinding.target.key)).resolves.toBe(9)
		await expect(getAddress({
			address: 'bc1qexample',
			target: bitcoinBinding.target.key,
		})).resolves.toMatchObject({
			address: 'bc1qexample',
			mempool_stats: {
				tx_count: 1,
			},
		})

		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			'https://blockstream.info/api/blocks',
			`https://blockstream.info/api/block/${'a'.repeat(64)}/txids`,
			'https://blockstream.info/api/mempool',
			'https://blockstream.info/api/fee-estimates',
			'https://blockstream.info/api/address/bc1qexample',
		])

		sourceGetJson.mockResolvedValueOnce({
			count: -1,
			vsize: 1,
			total_fee: 1,
		})
		await expect(getMempoolStats(bitcoinBinding.target.key)).rejects.toThrow('invalid mempool stats envelope')
	})
})
