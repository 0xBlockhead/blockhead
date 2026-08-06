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

const sourceFetch = vi.hoisted(() => vi.fn())
const getAccountPositions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))
vi.mock('$/sources/Morpho/Graphql/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Morpho/Graphql/queries.ts')>(),
	getAccountPositions,
}))

const { default: morphoGraphql } = await import('$/resolvers/Morpho-Graphql.ts')

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

const networkResolvers = morphoGraphql.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))

const vaultResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MorphoVault
))
const marketResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MorphoMarket
))
const morphoMarketPositionsResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$morphoMarketPositions' in resolver.projections
))
const morphoVaultPositionsResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$morphoVaultPositions' in resolver.projections
))

const market = {
	marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
	creationBlockNumber: 19326981,
	chain: {
		id: 8453,
	},
	loanAsset: {
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	},
	collateralAsset: {
		address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
	},
	lltv: '860000000000000000',
	irmAddress: '0x46415998764C29aB2a25CbeA6254146D50D22687',
	oracle: {
		address: '0x663BECd10daE6C4A3Dcd89F1d76c1174199639B9',
	},
	state: {
		supplyAssets: 1453572095573010,
		supplyShares: '1320911716664756276808',
		borrowAssets: 1315886527548583,
		borrowShares: '1181447494108739688848',
		timestamp: 1786052921,
		blockNumber: 49631787,
	},
}

const vault = {
	address: '0xBEEF000000000000000000000000000000000001',
	symbol: 'mvUSDC',
	name: 'MetaMorpho USDC',
	listed: true,
	asset: {
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
		decimals: 6,
	},
	chain: {
		id: 8453,
	},
}

describe('Morpho GraphQL resolver module', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		getAccountPositions.mockReset()
	})

	it('publishes Morpho account market and vault positions onto typed Many fields', async () => {
		if (morphoMarketPositionsResolver == null || morphoVaultPositionsResolver == null)
			throw new Error('missing Morpho account position resolvers')

		const accountSelector = {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			$actor: {
				address: '0x821880a3e2bac432d67e5155e72bb655ef65fa5e',
			},
		}
		const marketId = '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115'
		const vaultAddress = '0xbeef01735c132ada46aa9aa4c54623caa92a64cb'
		getAccountPositions.mockResolvedValue([
			{
				protocol: 'Morpho Blue',
				kind: 'market',
				chainId: 1,
				account: accountSelector.$actor.address,
				marketId,
				supplyAssets: '1000',
				supplyShares: '1000',
				borrowAssets: '0',
				borrowShares: '0',
				collateral: '0',
			},
			{
				protocol: 'Morpho Vault',
				kind: 'vault',
				chainId: 1,
				account: accountSelector.$actor.address,
				vaultAddress,
				vaultName: 'Steakhouse USDC',
				vaultSymbol: 'steakUSDC',
				assets: '500',
				shares: '500',
			},
		])

		const marketPositions = await morphoMarketPositionsResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)
		const vaultPositions = await morphoVaultPositionsResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)

		expect(morphoMarketPositionsResolver.projections.$$morphoMarketPositions.select(marketPositions)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$market: {
						$network: accountSelector.$network,
						marketId,
					},
				},
			},
		])
		expect(morphoMarketPositionsResolver.projections.$$morphoMarketPositions.resolveCount(marketPositions)).toBe(1)
		expect(morphoVaultPositionsResolver.projections.$$morphoVaultPositions.select(vaultPositions)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$vault: {
						$network: accountSelector.$network,
						vaultAddress,
					},
				},
			},
		])
		expect(morphoVaultPositionsResolver.projections.$$morphoVaultPositions.resolveCount(vaultPositions)).toBe(1)
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 1,
			account: accountSelector.$actor.address,
		})
	})

	it('rejects unsupported Morpho chains on account positions before transport', async () => {
		if (morphoMarketPositionsResolver == null)
			throw new Error('missing Morpho market positions resolver')

		await expect(
			morphoMarketPositionsResolver.resolve.EvmNetworkEvmAccount.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				$actor: {
					address: '0x821880a3e2bac432d67e5155e72bb655ef65fa5e',
				},
			}, context)
		).rejects.toThrow(`${Source.Morpho_Graphql}: unsupported chain id 999999`)
		expect(getAccountPositions).not.toHaveBeenCalled()
	})

	it('registers under Morpho_Graphql for Network, MorphoMarket, and MorphoVault', () => {
		expect(morphoGraphql.source).toBe(Source.Morpho_Graphql)
		expect(networkResolvers.length).toBe(2)
		expect(marketResolver).toBeDefined()
		expect(vaultResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		const networkResolver = networkResolvers[0]
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		await expect(
			networkResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'solana',
					reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
				},
			}, context)
		).rejects.toThrow(`${Source.Morpho_Graphql}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('resolves $$morphoMarkets selectors for the requested chain', async () => {
		const networkResolver = networkResolvers.find((resolver) => (
			resolver.projections.Evm.$$morphoMarkets != null
		))
		if (networkResolver == null)
			throw new Error('missing Network $$morphoMarkets resolver')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				markets: {
					items: [
						market,
					],
					pageInfo: {
						countTotal: 42,
					},
				},
			},
		})))

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		}

		const snapshot = await networkResolver.resolve.Caip2.resolve(network, context)
		expect(networkResolver.projections.Evm.$$morphoMarkets.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					marketId: market.marketId,
				},
			},
		])
		expect(networkResolver.projections.Evm.$$morphoMarkets.resolveCount(snapshot)).toBe(42)
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).variables).toMatchObject({
			limit: 16,
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).query).toContain('countTotal')
	})

	it('resolves $$morphoVaults selectors for the requested chain', async () => {
		const networkResolver = networkResolvers.find((resolver) => (
			resolver.projections.Evm.$$morphoVaults != null
		))
		if (networkResolver == null)
			throw new Error('missing Network $$morphoVaults resolver')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaults: {
					items: [
						vault,
					],
					pageInfo: {
						countTotal: 17,
					},
				},
			},
		})))

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		}

		const snapshot = await networkResolver.resolve.Caip2.resolve(network, context)
		expect(networkResolver.projections.Evm.$$morphoVaults.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					vaultAddress: '0xbeef000000000000000000000000000000000001',
				},
			},
		])
		expect(networkResolver.projections.Evm.$$morphoVaults.resolveCount(snapshot)).toBe(17)
	})

	it('resolves MorphoMarket snapshot with enrolled config + tip state fields', async () => {
		if (marketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: market,
			},
		})))

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		}

		const snapshot = await marketResolver.resolve.NetworkMarketId.resolve({
			$network: network,
			marketId: market.marketId,
		}, context)

		expect(snapshot).toEqual({
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
			loanAssetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			collateralAssetAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
			oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
			irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
			lltvWad: '860000000000000000',
			creationBlockNumber: '19326981',
			totalSupplyAssets: '1453572095573010',
			totalSupplyShares: '1320911716664756276808',
			totalBorrowAssets: '1315886527548583',
			totalBorrowShares: '1181447494108739688848',
			lastIndexedBlock: '49631787',
			lastAccrualTimestamp: 1786052921,
		})
	})

	it('omits MorphoMarket tip fields when GraphQL state is null', async () => {
		if (marketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				marketById: {
					...market,
					state: null,
				},
			},
		})))

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		}

		await expect(marketResolver.resolve.NetworkMarketId.resolve({
			$network: network,
			marketId: market.marketId,
		}, context)).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
			loanAssetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			collateralAssetAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
			oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
			irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
			lltvWad: '860000000000000000',
			creationBlockNumber: '19326981',
		})
	})

	it('resolves MorphoVault snapshot by network and vault address', async () => {
		if (vaultResolver == null)
			throw new Error('missing MorphoVault resolver')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			data: {
				vaultByAddress: vault,
			},
		})))

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '8453',
			},
		}

		const snapshot = await vaultResolver.resolve.NetworkVaultAddress.resolve({
			$network: network,
			vaultAddress: vault.address,
		}, context)

		expect(snapshot).toEqual({
			$network: {
				[EntityMetaKey.Selector]: network,
			},
			vaultAddress: '0xbeef000000000000000000000000000000000001',
			name: vault.name,
			symbol: vault.symbol,
			listed: vault.listed,
			assetAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			assetDecimals: vault.asset.decimals,
		})
	})
})
