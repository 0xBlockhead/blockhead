import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Pendle/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
} from '$/sources/SourceBinding.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())
const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))
vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getAccountPositions } = await import('$/sources/Pendle/Contracts/queries.ts')

const word = (value: bigint) => `0x${value.toString(16).padStart(64, '0')}`
const marketAddress = '0x00b321d89a8c36b3929f20b7955080baed706d1b'

describe('Pendle contract account operations', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
		sourceGetJson.mockReset()
	})

	it('binds every cataloged Pendle chain to EVM execution JSON-RPC', () => {
		const executionBindings = bindings[Source.Pendle_Rest].filter(({ apiFamily }) => (
			apiFamily === ApiFamily.EvmExecutionJsonRpc
		))

		expect(bindings[Source.Pendle_Rest].filter(({ apiFamily }) => (
			apiFamily === ApiFamily.RestJson
		))).toHaveLength(1)
		expect(executionBindings).toHaveLength(11)
		expect(executionBindings.every(({ delivery }) => (
			delivery === SourceDelivery.HttpProxy
		))).toBe(true)
		expect(executionBindings.map(({ target }) => target.key)).toEqual([
			'1',
			'10',
			'56',
			'143',
			'146',
			'999',
			'5000',
			'8453',
			'9745',
			'42161',
			'80094',
		])
	})

	it('reads PT, YT, SY, and LP balances at one block and keeps only active markets', async () => {
		sourceGetJson.mockResolvedValueOnce({
			total: 1,
			limit: 100,
			skip: 0,
			results: [
				{
					name: 'USD0++',
					protocol: 'Usual',
					icon: '',
					address: marketAddress,
					expiry: '2026-10-31T00:00:00.000Z',
					pt: '1-0x270d664d2fc7d962012a787aec8661ca83df24eb',
					yt: '1-0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					sy: '1-0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAsset: '1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					accountingAsset: '1-0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					details: {
						liquidity: 1,
						totalTvl: 1,
						tradingVolume: 1,
						underlyingApy: 0.01,
						swapFeeApy: 0.01,
						pendleApy: 0.01,
						ytFloatingApy: 0.01,
						impliedApy: 0.01,
						feeRate: 0.001,
						totalPt: 1,
						totalSy: 1,
						totalSupply: 1,
						totalActiveSupply: 1,
						aggregatedApy: 0.01,
						maxBoostedApy: 0.01,
					},
					isNew: false,
					isPrime: false,
					timestamp: '2026-08-06T08:47:11.000Z',
					categoryIds: [],
					chainId: 1,
				},
			],
		})
		jsonRpc2
			.mockResolvedValueOnce('0x64')
			.mockResolvedValueOnce(word(5n))
			.mockResolvedValueOnce(word(0n))
			.mockResolvedValueOnce(word(9n))
			.mockResolvedValueOnce(word(7n))

		await expect(getAccountPositions({
			chainId: 1,
			account: '0x0000000000000000000000000000000000000001',
		})).resolves.toEqual({
			blockNumber: 100n,
			positions: [
				{
					protocol: 'Pendle V2',
					chainId: 1,
					marketAddress,
					marketName: 'USD0++',
					expiryTimestampMs: Date.parse('2026-10-31T00:00:00.000Z'),
					ptAddress: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
					ytAddress: '0x4f0b4e6512630480b868e62a8a1d3451b0e9192d',
					syAddress: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
					underlyingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					accountingAssetAddress: '0x35d8949372d46b7a3d5a56006ae77b215fc69bc0',
					impliedApy: 0.01,
					underlyingApy: 0.01,
					swapFeeApy: 0.01,
					pendleApy: 0.01,
					ytFloatingApy: 0.01,
					aggregatedApy: 0.01,
					maxBoostedApy: 0.01,
					balances: [
						{
							kind: 'PT',
							address: '0x270d664d2fc7d962012a787aec8661ca83df24eb',
							balance: '5',
						},
						{
							kind: 'SY',
							address: '0x47bce1bb5d9a9072161ec25009bcd6e8d367b7d3',
							balance: '9',
						},
						{
							kind: 'LP',
							address: marketAddress,
							balance: '7',
						},
					],
				},
			],
		})
		expect(jsonRpc2).toHaveBeenCalledTimes(5)
	})

	it('rejects account reads without a chain binding', async () => {
		await expect(getAccountPositions({
			chainId: 11155111,
			account: '0x0000000000000000000000000000000000000001',
		})).rejects.toThrow(`${Source.Pendle_Rest}: unsupported chain id 11155111`)
		expect(sourceGetJson).not.toHaveBeenCalled()
		expect(jsonRpc2).not.toHaveBeenCalled()
	})

	it('rejects invalid accounts before transport', async () => {
		await expect(getAccountPositions({
			chainId: 1,
			account: 'not-an-address',
		})).rejects.toThrow(`${Source.Pendle_Rest}: invalid account not-an-address`)
		expect(sourceGetJson).not.toHaveBeenCalled()
		expect(jsonRpc2).not.toHaveBeenCalled()
	})
})
