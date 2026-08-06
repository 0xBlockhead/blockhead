import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NetworkEnvironment } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getAssetList = vi.fn()
const getChain = vi.fn()

vi.mock('$/sources/CosmosChainRegistry/Github/queries.ts', () => ({
	getAssetList,
	getChain,
}))

const { default: cosmosChainRegistryResolvers } = await import(
	'$/resolvers/CosmosChainRegistry-Github.ts'
)

const networkResolvers = cosmosChainRegistryResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.Network
))
const networkResolver = networkResolvers.find((resolver) => (
	'name' in resolver.projections
))
const nativeAssetsResolver = networkResolvers.find((resolver) => (
	'$$nativeAssets' in resolver.projections
))
const assetResolver = cosmosChainRegistryResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AssetInstance
))

if (networkResolver == null)
	throw new Error('CosmosChainRegistry-Github spec missing Network fields resolver')
if (nativeAssetsResolver == null)
	throw new Error('CosmosChainRegistry-Github spec missing Network.$$nativeAssets resolver')
if (assetResolver == null)
	throw new Error('CosmosChainRegistry-Github spec missing AssetInstance resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const enrolled = [
	{
		chainName: 'cosmoshub',
		caip2Network: {
			caip2: {
				namespace: 'cosmos',
				reference: 'cosmoshub-4',
			},
		},
		slugNetwork: {
			slug: 'cosmos',
		},
		chain: {
			chain_name: 'cosmoshub',
			chain_id: 'cosmoshub-4',
			pretty_name: 'Cosmos Hub',
		},
		assetList: {
			chain_name: 'cosmoshub',
			assets: [{
				type_asset: 'sdk.coin',
				base: 'uatom',
				name: 'Cosmos Hub Atom',
				symbol: 'ATOM',
				display: 'atom',
				denom_units: [
					{
						denom: 'uatom',
						exponent: 0,
					},
					{
						denom: 'atom',
						exponent: 6,
					},
				],
			}],
		},
	},
	{
		chainName: 'osmosis',
		caip2Network: {
			caip2: {
				namespace: 'cosmos',
				reference: 'osmosis-1',
			},
		},
		slugNetwork: {
			slug: 'osmosis',
		},
		chain: {
			chain_name: 'osmosis',
			chain_id: 'osmosis-1',
			pretty_name: 'Osmosis',
		},
		assetList: {
			chain_name: 'osmosis',
			assets: [{
				type_asset: 'sdk.coin',
				base: 'uosmo',
				name: 'Osmosis',
				symbol: 'OSMO',
				display: 'osmo',
				denom_units: [
					{
						denom: 'uosmo',
						exponent: 0,
					},
					{
						denom: 'osmo',
						exponent: 6,
					},
				],
			}],
		},
	},
	{
		chainName: 'dydx',
		caip2Network: {
			caip2: {
				namespace: 'cosmos',
				reference: 'dydx-mainnet-1',
			},
		},
		slugNetwork: {
			slug: 'dydx',
		},
		chain: {
			chain_name: 'dydx',
			chain_id: 'dydx-mainnet-1',
			pretty_name: 'dYdX Chain',
		},
		assetList: {
			chain_name: 'dydx',
			assets: [{
				type_asset: 'sdk.coin',
				base: 'adydx',
				name: 'dYdX',
				symbol: 'DYDX',
				display: 'dydx',
				denom_units: [
					{
						denom: 'adydx',
						exponent: 0,
					},
					{
						denom: 'dydx',
						exponent: 18,
					},
				],
			}],
		},
	},
] as const

describe('Cosmos Chain Registry multi-chain selectors', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('keeps exact applicability for every enrolled CAIP-2 and slug selector', () => {
		for (const resolver of networkResolvers) {
			expect(resolver.resolve.Caip2.appliesTo).toEqual(
				enrolled.map((row) => row.caip2Network)
			)
			expect(resolver.resolve.Slug.appliesTo).toEqual(
				enrolled.map((row) => row.slugNetwork)
			)
		}
	})

	it.each(enrolled)('projects $chainName network fields and native assets through both selectors', async (row) => {
		getChain.mockResolvedValue(row.chain)
		getAssetList.mockResolvedValue(row.assetList)

		const caip2Snapshot = await networkResolver.resolve.Caip2.resolve(
			row.caip2Network,
			resolverContext
		)
		const slugSnapshot = await networkResolver.resolve.Slug.resolve(
			row.slugNetwork,
			resolverContext
		)
		expect(getChain).toHaveBeenCalledWith({ chainName: row.chainName })
		expect(networkResolver.projections.name(caip2Snapshot)).toBe(row.chain.pretty_name)
		expect(networkResolver.projections.environment(caip2Snapshot)).toBe(NetworkEnvironment.Mainnet)
		expect(slugSnapshot).toEqual(caip2Snapshot)

		const caip2Assets = nativeAssetsResolver.projections.$$nativeAssets(
			await nativeAssetsResolver.resolve.Caip2.resolve(
				row.caip2Network,
				resolverContext
			)
		)
		expect(getAssetList).toHaveBeenCalledWith({ chainName: row.chainName })
		expect(caip2Assets).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: row.caip2Network,
				kind: AssetInstanceKind.Denom,
				assetKey: row.assetList.assets[0].base,
			},
			name: row.assetList.assets[0].name,
			symbol: row.assetList.assets[0].symbol,
			decimals: row.assetList.assets[0].denom_units[1].exponent,
		}])
	})

	it('resolves direct asset fields across enrolled networks and rejects foreign networks before I/O', async () => {
		const row = enrolled[1]
		getAssetList.mockResolvedValue(row.assetList)
		const resolve = assetResolver.resolve.NetworkKindAssetKey.resolve
		const caip2Asset = await resolve({
			$network: row.caip2Network,
			kind: AssetInstanceKind.Denom,
			assetKey: 'uosmo',
		}, resolverContext)
		const slugAsset = await resolve({
			$network: row.slugNetwork,
			kind: AssetInstanceKind.Denom,
			assetKey: 'uosmo',
		}, resolverContext)
		expect(slugAsset).toEqual(caip2Asset)
		expect(getAssetList).toHaveBeenCalledWith({ chainName: 'osmosis' })

		await expect(networkResolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		await expect(networkResolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'cosmos',
				reference: 'juno-1',
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getChain).not.toHaveBeenCalled()
	})
})
