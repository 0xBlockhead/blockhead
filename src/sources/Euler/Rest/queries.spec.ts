import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Euler/bindings.ts'
import {
	eulerEvkByChainId,
	eulerEvkChains,
	eulerVaultListDefaultLimit,
} from '$/sources/Euler/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getVault,
	listVaults,
} = await import('$/sources/Euler/Rest/queries.ts')

const binding = bindings[Source.Euler_Rest][0]

const baseVaultAddress = '0x00011d9A1EB3d7278b8DF2391e2E32f6f9bcF293'

const baseVaultSummary = {
	chainId: 1,
	address: baseVaultAddress,
	vaultType: 'evk',
	name: 'EVK Vault ePT-USDS-14AUG2025-2',
	symbol: 'ePT-USDS-14AUG2025-2',
	decimals: 18,
	asset: {
		address: '0xFfEc096c087C13Cc268497B89A613cACE4DF9A48',
		symbol: 'PT-USDS-14AUG2025',
		decimals: 18,
		name: 'PT USDS Stablecoin 14AUG2025',
	},
	totalAssets: '0',
	totalBorrows: '0',
	totalSupplyUsd: 0,
	totalBorrowsUsd: 0,
	utilization: 0,
	supplyApy: 0,
	borrowApy: 0,
	createdAt: '2025-07-09T21:17:23.000Z',
} as const

const baseVaultDetail = {
	...baseVaultSummary,
	dToken: '0xF5Eb68877521bB8763EC4aE65E85fac7C2522766',
	oracle: {
		oracle: '0x7516DB548B7bBC551F7213F77A275af2EdA6555d',
		name: 'EulerRouter',
	},
	governor: '0x35400831044167E9E2DE613d26515eeE37e30a1b',
	supplyCap: '0',
	borrowCap: '0',
	fees: {
		interestFee: 0.1,
	},
} as const

describe('Euler Data v3 REST binding', () => {
	it('targets the official Euler v3 API', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'euler-v3-api',
		})
		expect(binding.source).toBe(Source.Euler_Rest)
		expect(binding.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(binding.apiFamily).toBe(ApiFamily.RestJson)
		expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://v3.euler.finance',
				corsEnabled: true,
			},
		])
	})

	it('catalogs supported EVK chains including Ethereum', () => {
		expect(eulerEvkByChainId[1]).toEqual({
			chainId: 1,
			name: 'ethereum',
		})
		expect(eulerEvkChains.some((chain) => chain.chainId === 8453)).toBe(true)
	})
})

describe('Euler EVK vault operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('lists vaults for a supported chain', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [
				baseVaultSummary,
			],
			meta: {
				total: 872,
				offset: 0,
				limit: eulerVaultListDefaultLimit,
			},
		})
		await expect(listVaults({
			chainId: 1,
		})).resolves.toEqual([
			{
				chainId: 1,
				vaultAddress: '0x00011d9a1eb3d7278b8df2391e2e32f6f9bcf293',
				name: 'EVK Vault ePT-USDS-14AUG2025-2',
				symbol: 'ePT-USDS-14AUG2025-2',
				decimals: 18,
				assetAddress: '0xffec096c087c13cc268497b89a613cace4df9a48',
				assetSymbol: 'PT-USDS-14AUG2025',
				totalAssets: '0',
				totalBorrows: '0',
				totalSupplyUsd: 0,
				totalBorrowsUsd: 0,
				utilization: 0,
				supplyApy: 0,
				borrowApy: 0,
				createdAt: '2025-07-09T21:17:23.000Z',
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/v3/evk/vaults', {
				chainId: 1,
				limit: eulerVaultListDefaultLimit,
				offset: 0,
			})
		)
	})

	it('preserves an upstream successful empty vault list', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [],
			meta: {
				total: 0,
				offset: 0,
				limit: eulerVaultListDefaultLimit,
			},
		})

		await expect(listVaults({
			chainId: 1,
		})).resolves.toEqual([])
	})

	it('fails closed when a vault list contains another chain', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [
				{
					...baseVaultSummary,
					chainId: 8453,
				},
			],
		})

		await expect(listVaults({
			chainId: 1,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault chain mismatch`)
	})

	it('rejects invalid vault list limits before transport', async () => {
		await expect(listVaults({
			chainId: 1,
			limit: 0,
		})).rejects.toThrow(`${Source.Euler_Rest}: limit must be 1..1000`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('fails closed when the vault list response has no data', async () => {
		sourceGetJson.mockResolvedValueOnce({})

		await expect(listVaults({
			chainId: 1,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault list response missing data`)
	})

	it('reads vault detail by chain id and vault address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: baseVaultDetail,
		})
		await expect(getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})).resolves.toMatchObject({
			vaultAddress: '0x00011d9a1eb3d7278b8df2391e2e32f6f9bcf293',
			oracleAddress: '0x7516db548b7bbc551f7213f77a275af2eda6555d',
			governorAddress: '0x35400831044167e9e2de613d26515eee37e30a1b',
			dTokenAddress: '0xf5eb68877521bb8763ec4ae65e85fac7c2522766',
			interestFee: 0.1,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, `/v3/evk/vaults/1/${baseVaultAddress.toLowerCase()}`)
		)
	})

	it('rejects an unsupported chain id before transport', async () => {
		await expect(listVaults({
			chainId: 999999,
		})).rejects.toThrow(`${Source.Euler_Rest}: unsupported chain id`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects an invalid vault address before transport', async () => {
		await expect(getVault({
			chainId: 1,
			vaultAddress: 'not-an-address',
		})).rejects.toThrow(`${Source.Euler_Rest}: invalid vault address`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('throws when vault detail data is missing', async () => {
		sourceGetJson.mockResolvedValueOnce({})
		await expect(getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault response missing data`)
	})
})
