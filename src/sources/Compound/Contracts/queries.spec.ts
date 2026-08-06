import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Compound/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
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

const { getAccountPositions } = await import('$/sources/Compound/Contracts/queries.ts')

const word = (value: bigint) => `0x${value.toString(16).padStart(64, '0')}`

describe('Compound III contract account operations', () => {
	beforeEach(() => {
		jsonRpc2.mockReset()
		sourceGetJson.mockReset()
	})

	it('binds every cataloged Compound chain to EVM execution JSON-RPC', () => {
		const executionBindings = bindings[Source.Compound_Rest].filter(({ apiFamily }) => (
			apiFamily === ApiFamily.EvmExecutionJsonRpc
		))

		expect(bindings[Source.Compound_Rest].filter(({ apiFamily }) => (
			apiFamily === ApiFamily.RestJson
		))).toHaveLength(1)
		expect(executionBindings).toHaveLength(10)
		expect(executionBindings.every(({ delivery, target, wireProtocol }) => (
			delivery === SourceDelivery.HttpProxy
			&& target.kind === SourceTargetKind.Eip155Chain
			&& wireProtocol === WireProtocol.JsonRpc2
		))).toBe(true)
	})

	it('reads a complete account position at one block', async () => {
		jsonRpc2
			.mockResolvedValueOnce('0x64')
			.mockResolvedValueOnce(word(1_000_000n))
			.mockResolvedValueOnce(word(0n))
			.mockResolvedValueOnce(word(0n))
		sourceGetJson.mockResolvedValue({
			name: 'Compound USDC',
			symbol: 'cUSDCv3',
			baseToken: 'USDC',
			baseTokenAddress: '0x06eFdBFaB61A73C7E752b4e46FDEB38097dECea5',
			baseTokenPriceFeed: '0x43d12Fb3AfCAd5347fA764EeAB105478337b7200',
			assets: {
				WETH: {
					address: '0x5300000000000000000000000000000000000004',
					priceFeed: '0x5385CbBC9cF4f8cF9E21A2B92C1B5DEe1B1916cB',
					decimals: '18',
					borrowCF: 0.75,
					liquidateCF: 0.8,
					liquidationFactor: 0.85,
					supplyCap: '1000e18',
				},
			},
		})

		await expect(getAccountPositions({
			chainId: 534352,
			account: '0x0000000000000000000000000000000000000001',
		})).resolves.toEqual({
			blockNumber: 100n,
			positions: [
				expect.objectContaining({
					protocol: 'Compound III',
					chainId: 534352,
					marketSlug: 'usdc',
					baseToken: expect.objectContaining({
						suppliedBalance: '1000000',
						borrowedBalance: '0',
					}),
					collateral: [],
				}),
			],
		})
		expect(jsonRpc2).toHaveBeenCalledTimes(4)
	})

	it('rejects account reads without a chain binding', async () => {
		await expect(getAccountPositions({
			chainId: 11155111,
			account: '0x0000000000000000000000000000000000000001',
		})).rejects.toThrow(`${Source.Compound_Rest}: no EVM execution binding for chain 11155111`)
		expect(jsonRpc2).not.toHaveBeenCalled()
	})
})
