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
	getAccountPositions,
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

const baseAccountPosition = {
	chainId: 1,
	account: baseVaultAddress,
	vault: '0x01864aE3c7d5f507cC4c24cA67B4CABbDdA37EcD',
	vaultType: 'evk',
	asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
	shares: '617',
	assets: '627',
	borrowed: '0',
	assetsValue: '627',
	debtValue: '0',
	isCollateral: false,
	balanceForwarderEnabled: false,
	isController: false,
	liquidity: null,
	subAccount: {
		owner: '0x0000000000000000000000000000000000000000',
		timestamp: '2026-08-05T13:08:35.000Z',
		lastAccountStatusCheckTimestamp: '1970-01-01T00:00:00.000Z',
		enabledControllers: [],
		enabledCollaterals: [],
		isLockdownMode: false,
		isPermitDisabledMode: false,
	},
	snapshot: {
		timestamp: '2026-08-06T01:56:42.000Z',
		ageSeconds: 1,
		source: 'accountLensVaultInfo',
		method: 'live-read-through',
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
		})).resolves.toEqual({
			vaults: [
				{
					chainId: 1,
					vaultAddress: '0x00011d9a1eb3d7278b8df2391e2e32f6f9bcf293',
					vaultType: 'evk',
					name: 'EVK Vault ePT-USDS-14AUG2025-2',
					symbol: 'ePT-USDS-14AUG2025-2',
					decimals: 18,
					assetAddress: '0xffec096c087c13cc268497b89a613cace4df9a48',
					assetSymbol: 'PT-USDS-14AUG2025',
					assetName: 'PT USDS Stablecoin 14AUG2025',
					assetDecimals: 18,
					totalAssets: '0',
					totalBorrows: '0',
					totalSupplyUsd: 0,
					totalBorrowsUsd: 0,
					utilization: 0,
					supplyApy: 0,
					borrowApy: 0,
					createdAt: '2025-07-09T21:17:23.000Z',
				},
			],
			totalCount: 872,
			offset: 0,
		})
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
		})).resolves.toEqual({
			vaults: [],
			totalCount: 0,
			offset: 0,
		})
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

	it('fails closed when a vault list omits a required metric', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [
				{
					...baseVaultSummary,
					totalAssets: undefined,
				},
			],
		})

		await expect(listVaults({
			chainId: 1,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault missing totalAssets`)
	})

	it('rejects duplicate vault identities after address normalization', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [
				baseVaultSummary,
				{
					...baseVaultSummary,
					address: baseVaultSummary.address.toLowerCase(),
				},
			],
		})

		await expect(listVaults({
			chainId: 1,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault list contains duplicate vault identities`)
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

	it('fails closed when vault detail does not match its requested address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseVaultDetail,
				address: '0x0000000000000000000000000000000000000000',
			},
		})

		await expect(getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault address mismatch`)
	})

	it('fails closed when vault detail has an incomplete fees envelope', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseVaultDetail,
				fees: {},
			},
		})

		await expect(getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: vault missing interestFee`)
	})

	it('reads vault detail including createdAtBlock', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseVaultDetail,
				createdAtBlock: '12345',
			},
		})

		await expect(getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})).resolves.toMatchObject({
			vaultAddress: '0x00011d9a1eb3d7278b8df2391e2e32f6f9bcf293',
			createdAtBlock: '12345',
		})
	})

	it('normalizes vault detail transport leftovers without requiring APP enrollment', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseVaultDetail,
				creator: '0x1111111111111111111111111111111111111111',
				governorAdmin: '0x2222222222222222222222222222222222222222',
				unitOfAccount: {
					address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					symbol: 'USDC',
					decimals: 6,
				},
				totalShares: '1000',
				totalBorrowed: '250',
				totalCash: '750',
				cash: '750',
				interestRate: '123',
				interestAccumulator: '456',
				accumulatedFees: '7',
				fees: {
					interestFee: 0.1,
					accumulatedFeesShares: '8',
					accumulatedFeesAssets: '9',
					governorFeeReceiver: '0x3333333333333333333333333333333333333333',
					protocolFeeReceiver: '0x4444444444444444444444444444444444444444',
					protocolFeeShare: 0.05,
				},
				interestRates: {
					borrowSPY: '0.000000001',
					borrowAPY: '0.05',
					supplyAPY: '0.04',
				},
				timestamp: '2026-08-06T00:00:00.000Z',
				evcCompatibleAsset: true,
				exchangeRate: '1.01',
			},
		})

		await expect(getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})).resolves.toMatchObject({
			vaultType: 'evk',
			oracleName: 'EulerRouter',
			assetName: 'PT USDS Stablecoin 14AUG2025',
			creatorAddress: '0x1111111111111111111111111111111111111111',
			governorAdminAddress: '0x2222222222222222222222222222222222222222',
			unitOfAccountAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			unitOfAccountSymbol: 'USDC',
			totalShares: '1000',
			totalBorrowed: '250',
			totalCash: '750',
			cash: '750',
			borrowSpy: '0.000000001',
			borrowApyExact: '0.05',
			supplyApyExact: '0.04',
			protocolFeeShare: 0.05,
			observationTimestamp: '2026-08-06T00:00:00.000Z',
			evcCompatibleAsset: true,
			exchangeRate: '1.01',
		})
	})

	it('omits empty interestRates leftover strings while keeping nonempty exact APYs', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseVaultDetail,
				interestRates: {
					borrowSPY: '',
					borrowAPY: '0.05',
					supplyAPY: '0.04',
				},
			},
		})

		const vault = await getVault({
			chainId: 1,
			vaultAddress: baseVaultAddress,
		})
		expect(vault).toMatchObject({
			borrowApyExact: '0.05',
			supplyApyExact: '0.04',
		})
		expect(vault).not.toHaveProperty('borrowSpy')
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

	it('reads EVC account positions for a supported chain', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [
				baseAccountPosition,
			],
			meta: {
				hasMore: false,
				offset: 0,
				limit: eulerVaultListDefaultLimit,
			},
		})

		await expect(getAccountPositions({
			chainId: 1,
			account: baseVaultAddress,
		})).resolves.toMatchObject([{
			chainId: 1,
			account: baseVaultAddress.toLowerCase(),
			vaultAddress: baseAccountPosition.vault.toLowerCase(),
			assets: '627',
			liquidity: null,
		}])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, `/v3/accounts/${baseVaultAddress.toLowerCase()}/positions`, {
				chainId: 1,
				limit: eulerVaultListDefaultLimit,
				offset: 0,
			})
		)
	})

	it('normalizes account position liquidity leftovers fail-closed', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [{
				...baseAccountPosition,
				liquidity: {
					vaultAddress: baseAccountPosition.vault,
					unitOfAccount: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
					daysToLiquidation: 'Infinity',
					liabilityValue: {
						value: '0',
						valueUsd: 0,
					},
					totalCollateralValue: {
						value: '627',
						valueUsd: 627,
					},
					collaterals: [{
						address: baseAccountPosition.asset,
						value: {
							value: '627',
						},
						valueUsd: 627,
					}],
				},
			}],
		})

		await expect(getAccountPositions({
			chainId: 1,
			account: baseVaultAddress,
		})).resolves.toMatchObject([{
			liquidity: {
				vaultAddress: baseAccountPosition.vault.toLowerCase(),
				unitOfAccount: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				daysToLiquidation: 'Infinity',
				collaterals: [{
					address: baseAccountPosition.asset.toLowerCase(),
					valueUsd: 627,
				}],
			},
		}])
	})

	it('fails closed when account position liquidity omits daysToLiquidation', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [{
				...baseAccountPosition,
				liquidity: {
					vaultAddress: baseAccountPosition.vault,
					unitOfAccount: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
				},
			}],
		})

		await expect(getAccountPositions({
			chainId: 1,
			account: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: account position missing liquidity.daysToLiquidation`)
	})

	it('fails closed when an account position response has no data', async () => {
		sourceGetJson.mockResolvedValueOnce({})

		await expect(getAccountPositions({
			chainId: 1,
			account: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: account positions response missing data`)
	})

	it('rejects duplicate account position identities after address normalization', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: [
				baseAccountPosition,
				{
					...baseAccountPosition,
					vault: baseAccountPosition.vault.toUpperCase(),
					asset: baseAccountPosition.asset.toUpperCase(),
					subAccount: {
						...baseAccountPosition.subAccount,
						owner: baseAccountPosition.subAccount.owner.toUpperCase(),
					},
				},
			],
		})

		await expect(getAccountPositions({
			chainId: 1,
			account: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: account positions contain duplicate identities`)
	})

	it('rejects an unsupported account-position chain before transport', async () => {
		await expect(getAccountPositions({
			chainId: 999999,
			account: baseVaultAddress,
		})).rejects.toThrow(`${Source.Euler_Rest}: unsupported chain id`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
