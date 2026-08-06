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
const evmNetworkAccountResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
))
const evmNetworkAccountTimestampResolver = morphoGraphql.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount_Timestamp
))

const market = {
	marketId: '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836',
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

	it('publishes and resolves Morpho account market/vault positions onto contractPositions', async () => {
		if (evmNetworkAccountResolver == null || evmNetworkAccountTimestampResolver == null)
			throw new Error('missing Morpho account resolvers')

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
		const account = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)
		const [timestampReference] = evmNetworkAccountResolver.projections.$$timestamps(account)
		if (timestampReference == null)
			throw new Error('missing Morpho account timestamp')

		getAccountPositions.mockResolvedValue([
			{
				protocol: 'Morpho Blue',
				kind: 'market',
				chainId: 1,
				account: accountSelector.$actor.address,
				marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
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
				vaultAddress: '0xbeef01735c132ada46aa9aa4c54623caa92a64cb',
				vaultName: 'Steakhouse USDC',
				vaultSymbol: 'steakUSDC',
				assets: '500',
				shares: '500',
			},
		])

		const snapshot = await evmNetworkAccountTimestampResolver.resolve.AccountTimestampMsSource.resolve(
			timestampReference[EntityMetaKey.Selector],
			context
		)

		expect(evmNetworkAccountTimestampResolver.projections.contractPositions(snapshot)).toEqual([
			expect.objectContaining({
				kind: 'market',
				marketId: '0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115',
			}),
			expect.objectContaining({
				kind: 'vault',
				vaultSymbol: 'steakUSDC',
			}),
		])
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 1,
			account: accountSelector.$actor.address,
		})
	})

	it('rejects unsupported Morpho chains on account positions before transport', async () => {
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
						address: '0x821880a3e2bac432d67e5155e72bb655ef65fa5e',
					},
				},
				timestampMs: 1760000000000,
				source: Source.Morpho_Graphql,
			}, context)
		).rejects.toThrow(`${Source.Morpho_Graphql}: unsupported chain id 999999`)
		expect(getAccountPositions).not.toHaveBeenCalled()
	})

	it('registers under Morpho_Graphql for Network and MorphoVault', () => {
		expect(morphoGraphql.source).toBe(Source.Morpho_Graphql)
		expect(networkResolvers.length).toBe(2)
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
		const markets = networkResolver.projections.Evm.$$morphoMarkets(snapshot)

		expect(markets).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					marketId: market.marketId,
				},
			},
		])
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).variables).toMatchObject({
			limit: 16,
		})
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
		const vaults = networkResolver.projections.Evm.$$morphoVaults(snapshot)

		expect(vaults).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					vaultAddress: '0xbeef000000000000000000000000000000000001',
				},
			},
		])
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
