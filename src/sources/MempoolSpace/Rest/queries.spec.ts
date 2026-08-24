import { beforeEach, describe, expect, it, vi } from 'vitest'

import lightningBindings from '$/sources/LightningMempoolSpace/bindings.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())
const sourceGetText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0]?.locator,
	sourceGetJson,
	sourceGetText,
}))

const {
	getBlock,
	getBlockHashByHeight,
	getBlockTransactionIds,
	getBlockTransactions,
	getBlocks,
	getAddress,
	getAddressTransactions,
	getAddressUtxos,
	getDifficultyAdjustment,
	getDifficultyAdjustments,
	getMempoolStats,
	getMiningHashrate,
	getMiningPool,
	getMiningPools,
	getOutspend,
	getRecommendedFees,
	getTipHeight,
	getTransaction,
	getTransactionProtocolPayloads,
} = await import('$/sources/MempoolSpace/Rest/queries.ts')

const [bitcoinBinding, bitcoinTestnetBinding] = bindings[Source.MempoolSpace_Rest]

const bitcoinTarget = bitcoinBinding.target.key
const bitcoinTestnetTarget = bitcoinTestnetBinding.target.key

const validBlock = {
	id: 'a'.repeat(64),
	height: 840_000,
	timestamp: 1_700_000_000,
	tx_count: 1,
}

describe('mempool.space Bitcoin REST binding', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		sourceGetText.mockReset()
	})

	it('validates the tip height boundary', async () => {
		sourceGetJson
			.mockResolvedValueOnce(840_000)
			.mockResolvedValueOnce(-1)

		await expect(getTipHeight({
			target: bitcoinTarget,
		})).resolves.toBe(840_000)
		await expect(getTipHeight({
			target: bitcoinTarget,
		})).rejects.toThrow('invalid tip height')
		expect(sourceGetJson).toHaveBeenCalledWith(bitcoinBinding, 'https://mempool.space/api/blocks/tip/height')
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

		await getBlock({
			blockHash: 'a'.repeat(64),
			target: bitcoinTarget,
		})
		await getRecommendedFees({
			target: bitcoinTarget,
		})

		expect(bitcoinBinding).not.toBe(
			lightningBindings[Source.LightningMempoolSpace_Rest][0]
		)
		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				`https://mempool.space/api/block/${'a'.repeat(64)}`,
			],
			[
				bitcoinBinding,
				'https://mempool.space/api/v1/fees/recommended',
			],
		])
	})

	it('binds the Bitcoin Testnet genesis coordinate to the official testnet API', async () => {
		sourceGetText.mockResolvedValueOnce('000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943')

		await expect(getBlockHashByHeight({
			height: 0n,
			target: bitcoinTestnetTarget,
		})).resolves.toBe('000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943')
		expect(sourceGetText).toHaveBeenCalledWith(
			bitcoinTestnetBinding,
			'https://mempool.space/testnet/api/block-height/0'
		)
	})

	it('selects the exact target binding and preserves its API prefix', async () => {
		sourceGetJson
			.mockResolvedValueOnce(validBlock)
			.mockResolvedValueOnce(validBlock)

		await getBlock({
			blockHash: validBlock.id,
			target: bitcoinTarget,
		})
		await getBlock({
			blockHash: validBlock.id,
			target: bitcoinTestnetTarget,
		})

		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				`https://mempool.space/api/block/${validBlock.id}`,
			],
			[
				bitcoinTestnetBinding,
				`https://mempool.space/testnet/api/block/${validBlock.id}`,
			],
		])
	})

	it('reads typed current mining hashrate from the canonical Bitcoin API binding', async () => {
		sourceGetJson.mockResolvedValueOnce({
			hashrates: [
				{
					timestamp: 1_786_320_000,
					avgHashrate: 897_045_400_620_083_300_000,
				},
			],
			difficulty: [],
			currentHashrate: 886_019_350_377_919_800_000,
			currentDifficulty: 127_479_855_693_691.4,
		})

		await expect(getMiningHashrate({
			target: bitcoinTarget,
		})).resolves.toMatchObject({
			currentHashrate: 886_019_350_377_919_800_000,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			'https://mempool.space/api/v1/mining/hashrate/3d'
		)
	})

	it('fails closed on malformed mining hashrate observations', async () => {
		sourceGetJson.mockResolvedValueOnce({
			hashrates: [],
			difficulty: [],
			currentHashrate: -1,
			currentDifficulty: 1,
		})

		await expect(getMiningHashrate({
			target: bitcoinTarget,
		})).rejects.toThrow('invalid mining hashrate envelope')
	})

	it('rejects duplicate mining hashrate observation clocks', async () => {
		sourceGetJson.mockResolvedValueOnce({
			hashrates: [
				{
					timestamp: 1_786_320_000,
					avgHashrate: 897_045_400_620_083_300_000,
				},
				{
					timestamp: 1_786_320_000,
					avgHashrate: 898_045_400_620_083_300_000,
				},
			],
			difficulty: [],
			currentHashrate: 886_019_350_377_919_800_000,
			currentDifficulty: 127_479_855_693_691.4,
		})

		await expect(getMiningHashrate({
			target: bitcoinTarget,
		})).rejects.toThrow('duplicate observation timestamps')
	})

	it('reads the current difficulty adjustment window from the canonical Bitcoin API binding', async () => {
		sourceGetJson.mockResolvedValueOnce({
			progressPercent: 48.56150793650794,
			difficultyChange: -2.170874871890427,
			estimatedRetargetDate: 1_787_455_458_780,
			remainingBlocks: 1037,
			remainingTime: 636_655_780,
			previousRetarget: 0.9889358055576736,
			previousTime: 1_786_217_755,
			nextRetargetHeight: 963_648,
			timeAvg: 613_940,
			adjustedTimeAvg: 613_940,
			timeOffset: 0,
			expectedBlocks: 1001.7466666666667,
		})

		await expect(getDifficultyAdjustment({
			target: bitcoinTarget,
		})).resolves.toMatchObject({
			progressPercent: 48.56150793650794,
			nextRetargetHeight: 963_648,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			'https://mempool.space/api/v1/difficulty-adjustment'
		)
	})

	it('fail-closes malformed difficulty adjustment envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			progressPercent: 48.56150793650794,
			difficultyChange: -2.170874871890427,
			estimatedRetargetDate: 1_787_455_458_780,
			remainingBlocks: 1037,
			remainingTime: 636_655_780,
			previousRetarget: 0.9889358055576736,
			previousTime: 1_786_217_755,
			nextRetargetHeight: 963_648,
			timeAvg: 613_940,
			adjustedTimeAvg: 613_940,
			timeOffset: 0,
			expectedBlocks: -1,
		})

		await expect(getDifficultyAdjustment({
			target: bitcoinTarget,
		})).rejects.toThrow('invalid difficulty adjustment envelope')
	})

	it('reads canonical difficulty adjustment tuples newest first and normalizes ratios to percent', async () => {
		sourceGetJson.mockResolvedValueOnce([
			[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
			[1_785_019_866, 959_616, 126_231_507_121_868.2, 0.992616],
			[1_783_800_551, 957_600, 127_170_500_429_035.2, 0.949956],
		])

		await expect(getDifficultyAdjustments({
			target: bitcoinTarget,
		})).resolves.toEqual([
			{
				time: 1_786_217_755,
				height: 961_632,
				difficulty: 127_479_855_693_691.4,
				adjustmentPercent: 0.9889999999999954,
			},
			{
				time: 1_785_019_866,
				height: 959_616,
				difficulty: 126_231_507_121_868.2,
				adjustmentPercent: -0.7383999999999946,
			},
			{
				time: 1_783_800_551,
				height: 957_600,
				difficulty: 127_170_500_429_035.2,
				adjustmentPercent: -5.004399999999998,
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			'https://mempool.space/api/v1/mining/difficulty-adjustments/3m'
		)
	})

	it('fail-closes malformed, duplicate, and out-of-order difficulty histories', async () => {
		sourceGetJson
			.mockResolvedValueOnce([[1_786_217_755, 961_632, -1, 1.00989]])
			.mockResolvedValueOnce([
				[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
				[1_785_019_866, 961_632, 126_231_507_121_868.2, 0.992616],
			])
			.mockResolvedValueOnce([
				[1_785_019_866, 959_616, 126_231_507_121_868.2, 0.992616],
				[1_786_217_755, 961_632, 127_479_855_693_691.4, 1.00989],
			])

		await expect(getDifficultyAdjustments({
			target: bitcoinTarget,
		})).rejects.toThrow('invalid difficulty adjustment history envelope')
		await expect(getDifficultyAdjustments({
			target: bitcoinTarget,
		})).rejects.toThrow('duplicate block heights')
		await expect(getDifficultyAdjustments({
			target: bitcoinTarget,
		})).rejects.toThrow('not newest first')
	})

	it('reads the mining pool catalog and a single pool by slug', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				{
					name: 'Unknown',
					slug: 'unknown',
					unique_id: 0,
				},
				{
					name: 'F2Pool',
					slug: 'f2pool',
					unique_id: 36,
				},
			])
			.mockResolvedValueOnce({
				pool: {
					id: 37,
					name: 'F2Pool',
					link: 'https://www.f2pool.com',
					addresses: [
						'1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY',
						'bc1qf274x7penhcd8hsv3jcmwa5xxzjl2a6pa9pxwm',
					],
					regexes: [
						'F2Pool',
						'🐟',
					],
					slug: 'f2pool',
					unique_id: 36,
				},
				blockCount: {
					all: 97_479,
					'24h': 18,
					'1w': 167,
				},
				blockShare: {
					all: 0.10126509954166373,
					'24h': 0.1232876712328767,
					'1w': 0.16851664984863773,
				},
				estimatedHashrate: 113_185_830_253_682_540_000,
				reportedHashrate: null,
				avgBlockHealth: 99.15,
				totalReward: '128416697905845',
			})

		await expect(getMiningPools({
			target: bitcoinTarget,
		})).resolves.toEqual([
			{
				name: 'Unknown',
				slug: 'unknown',
				unique_id: 0,
			},
			{
				name: 'F2Pool',
				slug: 'f2pool',
				unique_id: 36,
			},
		])
		await expect(getMiningPool({
			slug: 'f2pool',
			target: bitcoinTarget,
		})).resolves.toMatchObject({
			pool: {
				slug: 'f2pool',
			},
			blockCount: {
				'24h': 18,
			},
		})
		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://mempool.space/api/v1/mining/pools',
			],
			[
				bitcoinBinding,
				'https://mempool.space/api/v1/mining/pool/f2pool',
			],
		])
	})

	it('rejects duplicate mining pool catalog ids and substituted pool slugs', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				{
					name: 'Unknown',
					slug: 'unknown',
					unique_id: 0,
				},
				{
					name: 'F2Pool',
					slug: 'f2pool',
					unique_id: 0,
				},
			])
			.mockResolvedValueOnce({
				pool: {
					id: 37,
					name: 'F2Pool',
					link: 'https://www.f2pool.com',
					addresses: [],
					regexes: [],
					slug: 'antpool',
					unique_id: 36,
				},
				blockCount: {
					all: 97_479,
					'24h': 18,
					'1w': 167,
				},
				blockShare: {
					all: 0.10126509954166373,
					'24h': 0.1232876712328767,
					'1w': 0.16851664984863773,
				},
				estimatedHashrate: 113_185_830_253_682_540_000,
				reportedHashrate: null,
				avgBlockHealth: 99.15,
				totalReward: '128416697905845',
			})

		await expect(getMiningPools({
			target: bitcoinTarget,
		})).rejects.toThrow('duplicate catalog ids')
		await expect(getMiningPool({
			slug: 'f2pool',
			target: bitcoinTarget,
		})).rejects.toThrow('mining pool response has mismatched identity')
		await expect(getMiningPool({
			slug: '',
			target: bitcoinTarget,
		})).rejects.toThrow('mining pool slug is empty')
	})

	it('resolves block hash by height and address UTXOs on hard-fail paths', async () => {
		sourceGetText.mockResolvedValueOnce('a'.repeat(64))
		sourceGetJson
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

		await expect(getBlockHashByHeight({
			height: 840_000n,
			target: bitcoinTarget,
		})).resolves.toBe('a'.repeat(64))
		await expect(getAddressUtxos({
			address: 'bc1qexample',
			target: bitcoinTarget,
		})).resolves.toHaveLength(1)

		sourceGetJson.mockResolvedValueOnce([{
			txid: 'b'.repeat(64),
			vout: 1,
			status: {
				confirmed: false,
			},
		}])
		await expect(getAddressUtxos({
			address: 'bc1qexample',
			target: bitcoinTarget,
		})).rejects.toThrow('Bitcoin address UTXO is missing value')

		expect(sourceGetText.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://mempool.space/api/block-height/840000',
			],
		])
		expect(sourceGetJson.mock.calls).toEqual([
			[
				bitcoinBinding,
				'https://mempool.space/api/address/bc1qexample/utxo',
			],
			[
				bitcoinBinding,
				'https://mempool.space/api/address/bc1qexample/utxo',
			],
		])
	})

	it('accepts the genesis block null previous hash', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...validBlock,
			height: 0,
			previousblockhash: null,
		})

		await expect(getBlock({
			blockHash: 'a'.repeat(64),
			target: bitcoinTarget,
		})).resolves.toMatchObject({
			height: 0,
			previousblockhash: null,
		})
	})

	it('returns an identity-bound page of full block transactions', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			txid: 'b'.repeat(64),
			version: 2,
			locktime: 0,
			size: 120,
			weight: 480,
			vin: [],
			vout: [],
			status: {
				confirmed: true,
				block_hash: 'a'.repeat(64),
				block_height: 840_000,
			},
		}])

		await expect(getBlockTransactions({
			blockHash: 'a'.repeat(64),
			startIndex: 25,
			target: bitcoinTarget,
		})).resolves.toHaveLength(1)
		expect(sourceGetJson).toHaveBeenCalledWith(
			bitcoinBinding,
			`https://mempool.space/api/block/${'a'.repeat(64)}/txs/25`
		)
	})

	it('rejects substituted full block transaction pages', async () => {
		sourceGetJson.mockResolvedValueOnce([{
			txid: 'b'.repeat(64),
			vin: [],
			vout: [],
			status: {
				confirmed: true,
				block_hash: 'c'.repeat(64),
			},
		}])

		await expect(getBlockTransactions({
			blockHash: 'a'.repeat(64),
			startIndex: 0,
			target: bitcoinTarget,
		})).rejects.toThrow(
			'block transactions contain mismatched block identity'
		)
	})

	it('rejects invalid or substituted block, transaction, and address identities before returning provider rows', async () => {
		sourceGetJson.mockResolvedValueOnce({
			...validBlock,
			id: 'b'.repeat(64),
		})
		await expect(getBlock({
			blockHash: 'a'.repeat(64),
			target: bitcoinTarget,
		})).rejects.toThrow('block response has mismatched identity')

		sourceGetJson.mockResolvedValueOnce({
			txid: 'b'.repeat(64),
			status: { confirmed: false },
			vin: [],
			vout: [],
		})
		await expect(getTransaction(
			'a'.repeat(64),
			bitcoinTarget
		)).rejects.toThrow('transaction response has mismatched identity')

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
		await expect(getAddress({
			address: 'bc1qrequested',
			target: bitcoinTarget,
		})).rejects.toThrow('address response has mismatched identity')

		sourceGetJson.mockReset()
		for (const query of [
			() => getBlock({
				blockHash: 'not-a-hash',
				target: bitcoinTarget,
			}),
			() => getBlockTransactionIds({
				blockHash: 'not-a-hash',
				target: bitcoinTarget,
			}),
			() => getBlockTransactions({
				blockHash: 'not-a-hash',
				startIndex: 0,
				target: bitcoinTarget,
			}),
			() => getBlockTransactions({
				blockHash: 'a'.repeat(64),
				startIndex: -1,
				target: bitcoinTarget,
			}),
			() => getTransaction('not-a-transaction', bitcoinTarget),
			() => getBlockHashByHeight({
				height: -1n,
				target: bitcoinTarget,
			}),
			() => getBlocks({
				target: bitcoinTarget,
				startHeight: -1n,
			}),
			() => getAddress({
				address: '',
				target: bitcoinTarget,
			}),
			() => getAddressUtxos({
				address: '',
				target: bitcoinTarget,
			}),
			() => getAddressTransactions({
				address: 'bc1qrequested',
				target: bitcoinTarget,
				lastSeenTransactionId: 'not-a-transaction',
			}),
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
		await expect(getMempoolStats({
			target: bitcoinTarget,
		})).rejects.toThrow('invalid mempool stats envelope')

		sourceGetJson.mockResolvedValueOnce({
			fastestFee: 1,
			halfHourFee: 1,
			hourFee: Number.MAX_SAFE_INTEGER + 1,
			economyFee: 1,
			minimumFee: 1,
		})
		await expect(getRecommendedFees({
			target: bitcoinTarget,
		})).rejects.toThrow('invalid recommended fees envelope')
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
			getTransactionProtocolPayloads({
				txId,
				target: bitcoinTarget,
			})
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

		const payloads = await getTransactionProtocolPayloads({
			txId,
			target: bitcoinTarget,
		})
		expect(payloads.filter((payload) => payload.protocol === 'Ordinals')).toHaveLength(2)
		expect(payloads.find((payload) => payload.protocol === 'Runes')).toMatchObject({
			payloadHex: '020100',
			isCenotaph: false,
		})
	})

	it('preserves unspent and spent outspend envelopes', async () => {
		const txId = 'aa'.repeat(32)
		sourceGetJson
			.mockResolvedValueOnce({
				spent: false,
			})
			.mockResolvedValueOnce({
				spent: true,
				txid: 'bb'.repeat(32),
				vin: 0,
			})
			.mockResolvedValueOnce({
				spent: true,
			})

		await expect(getOutspend({
			txId,
			vout: 0,
			target: bitcoinTarget,
		})).resolves.toEqual({
			spent: false,
		})
		await expect(getOutspend({
			txId,
			vout: 1,
			target: bitcoinTarget,
		})).resolves.toMatchObject({
			spent: true,
			txid: 'bb'.repeat(32),
			vin: 0,
		})
		await expect(getOutspend({
			txId,
			vout: 1,
			target: bitcoinTarget,
		})).rejects.toThrow('spent outspend is missing spending identity')
		await expect(getOutspend({
			txId,
			vout: -1,
			target: bitcoinTarget,
		})).rejects.toThrow('outspend output index must be a non-negative safe integer')
		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			`https://mempool.space/api/tx/${txId}/outspend/0`,
			`https://mempool.space/api/tx/${txId}/outspend/1`,
			`https://mempool.space/api/tx/${txId}/outspend/1`,
		])
	})
})
