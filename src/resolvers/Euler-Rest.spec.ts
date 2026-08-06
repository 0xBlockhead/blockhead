import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())
const getAccountPositions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))
vi.mock('$/sources/Euler/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Euler/Rest/queries.ts')>(),
	getAccountPositions,
}))

const { default: eulerRest } = await import('$/resolvers/Euler-Rest.ts')

const baseNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const eulerEvkVaultResolver = eulerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EulerEvkVault
))

const networkEulerEvkVaultsResolver = eulerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$eulerEvkVaults' in resolver.projections.Evm
))
const evmNetworkAccountResolver = eulerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
))
const evmNetworkAccountTimestampResolver = eulerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount_Timestamp
))

const baseVaultAddress = '0x00011d9A1EB3d7278b8DF2391e2E32f6f9bcF293'

const baseVaultDetail = {
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
	dTokenAddress: '0xf5eb68877521bb8763ec4ae65e85fac7c2522766',
	oracleAddress: '0x7516db548b7bbc551f7213f77a275af2eda6555d',
	governorAddress: '0x35400831044167e9e2de613d26515eee37e30a1b',
	supplyCap: '0',
	borrowCap: '0',
	interestFee: 0.1,
} as const

describe('Euler Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
		getAccountPositions.mockReset()
	})

	it('publishes and resolves Euler EVC account positions onto contractPositions', async () => {
		if (evmNetworkAccountResolver == null || evmNetworkAccountTimestampResolver == null)
			throw new Error('missing Euler account resolvers')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}
		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)
		const [timestampReference] = evmNetworkAccountResolver.projections.$$timestamps(account)
		if (timestampReference == null)
			throw new Error('missing Euler account timestamp')

		getAccountPositions.mockResolvedValue([
			{
				chainId: 1,
				account: accountSelector.$actor.address,
				vaultAddress: '0x01864ae3c7d5f507cc4c24ca67b4cabbdda37ecd',
				vaultType: 'evk',
				assets: '627',
				borrowed: '0',
			},
		])

		const snapshot = await evmNetworkAccountTimestampResolver.resolve.AccountTimestampMsSource.resolve(
			timestampReference[EntityMetaKey.Selector],
			context
		)

		expect(evmNetworkAccountTimestampResolver.projections.contractPositions(snapshot)).toEqual([
			expect.objectContaining({
				vaultAddress: '0x01864ae3c7d5f507cc4c24ca67b4cabbdda37ecd',
				assets: '627',
			}),
		])
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 1,
			account: accountSelector.$actor.address,
		})
	})

	it('preserves an empty Euler positions list on contractPositions', async () => {
		if (evmNetworkAccountTimestampResolver == null)
			throw new Error('missing EvmNetworkAccount_Timestamp resolver')

		getAccountPositions.mockResolvedValue([])

		const snapshot = await evmNetworkAccountTimestampResolver.resolve.AccountTimestampMsSource.resolve({
			$account: {
				$network: baseNetwork,
				$actor: {
					address: '0x0000000000000000000000000000000000000001',
				},
			},
			timestampMs: 1760000000000,
			source: Source.Euler_Rest,
		}, context)

		expect(evmNetworkAccountTimestampResolver.projections.contractPositions(snapshot)).toEqual([])
	})

	it('rejects unsupported Euler chains on account positions before transport', async () => {
		if (evmNetworkAccountTimestampResolver == null)
			throw new Error('missing EvmNetworkAccount_Timestamp resolver')

		await expect(
			evmNetworkAccountTimestampResolver.resolve.AccountTimestampMsSource.resolve({
				$account: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '999999',
						},
					},
					$actor: {
						address: '0x0000000000000000000000000000000000000001',
					},
				},
				timestampMs: 1760000000000,
				source: Source.Euler_Rest,
			}, context)
		).rejects.toThrow(`${Source.Euler_Rest}: unsupported chain id 999999`)
		expect(getAccountPositions).not.toHaveBeenCalled()
	})

	it('registers under Euler_Rest for EulerEvkVault', () => {
		expect(eulerRest.source).toBe(Source.Euler_Rest)
		expect(eulerEvkVaultResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (eulerEvkVaultResolver == null)
			throw new Error('missing EulerEvkVault resolver')

		await expect(
			eulerEvkVaultResolver.resolve.NetworkVaultAddress.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				vaultAddress: baseVaultAddress,
			}, context)
		).rejects.toThrow(`${Source.Euler_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported Euler chains on EulerEvkVault before transport', async () => {
		if (eulerEvkVaultResolver == null)
			throw new Error('missing EulerEvkVault resolver')

		await expect(
			eulerEvkVaultResolver.resolve.NetworkVaultAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				vaultAddress: baseVaultAddress,
			}, context)
		).rejects.toThrow(`${Source.Euler_Rest}: unsupported chain id 999999`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported Euler chains on Network $$eulerEvkVaults before transport', async () => {
		if (networkEulerEvkVaultsResolver == null)
			throw new Error('missing Network $$eulerEvkVaults resolver')

		await expect(
			networkEulerEvkVaultsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'eip155',
					reference: '999999',
				},
			}, context)
		).rejects.toThrow(`${Source.Euler_Rest}: unsupported chain id 999999`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves an Euler EVK vault snapshot by network and vault address', async () => {
		if (eulerEvkVaultResolver == null)
			throw new Error('missing EulerEvkVault resolver')

		sourceGetJson.mockResolvedValueOnce({
			data: {
				chainId: 1,
				address: baseVaultAddress,
				vaultType: 'evk',
				name: baseVaultDetail.name,
				symbol: baseVaultDetail.symbol,
				decimals: baseVaultDetail.decimals,
				asset: {
					address: '0xFfEc096c087C13Cc268497B89A613cACE4DF9A48',
					symbol: baseVaultDetail.assetSymbol,
					decimals: 18,
					name: 'PT USDS Stablecoin 14AUG2025',
				},
				totalAssets: baseVaultDetail.totalAssets,
				totalBorrows: baseVaultDetail.totalBorrows,
				totalSupplyUsd: baseVaultDetail.totalSupplyUsd,
				totalBorrowsUsd: baseVaultDetail.totalBorrowsUsd,
				utilization: baseVaultDetail.utilization,
				supplyApy: baseVaultDetail.supplyApy,
				borrowApy: baseVaultDetail.borrowApy,
				createdAt: baseVaultDetail.createdAt,
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
			},
		})

		const snapshot = await eulerEvkVaultResolver.resolve.NetworkVaultAddress.resolve({
			$network: baseNetwork,
			vaultAddress: baseVaultAddress,
		}, context)

		expect(eulerEvkVaultResolver.projections.vaultAddress(snapshot)).toBe(
			'0x00011d9a1eb3d7278b8df2391e2e32f6f9bcf293'
		)
		expect(eulerEvkVaultResolver.projections.assetAddress(snapshot)).toBe(
			'0xffec096c087c13cc268497b89a613cace4df9a48'
		)
		expect(eulerEvkVaultResolver.projections.oracleAddress(snapshot)).toBe(
			'0x7516db548b7bbc551f7213f77a275af2eda6555d'
		)
		expect(eulerEvkVaultResolver.projections.interestFee(snapshot)).toBe(0.1)
		expect(eulerEvkVaultResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(1)
	})
})
