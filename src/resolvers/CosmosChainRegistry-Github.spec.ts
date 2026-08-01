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
const caip2Network = {
	caip2: {
		namespace: 'cosmos',
		reference: 'cosmoshub-4',
	},
} as const
const slugNetwork = {
	slug: 'cosmos',
} as const
const assetList = {
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
}

describe('Cosmos Chain Registry network selectors', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getChain.mockResolvedValue({
			chain_name: 'cosmoshub',
			pretty_name: 'Cosmos Hub',
		})
		getAssetList.mockResolvedValue(assetList)
	})

	it('keeps separate exact applicability for both editable selector entries', () => {
		for (const resolver of networkResolvers) {
			expect(resolver.resolve.Caip2.appliesTo).toEqual([caip2Network])
			expect(resolver.resolve.Slug.appliesTo).toEqual([slugNetwork])
		}
	})

	it('projects equivalent network fields and native assets through both selectors', async () => {
		const caip2Snapshot = await networkResolver.resolve.Caip2.resolve(
			caip2Network,
			resolverContext
		)
		const slugSnapshot = await networkResolver.resolve.Slug.resolve(
			slugNetwork,
			resolverContext
		)
		expect(getChain).toHaveBeenCalledTimes(2)
		expect(getChain).toHaveBeenNthCalledWith(1, { chainName: 'cosmoshub' })
		expect(getChain).toHaveBeenNthCalledWith(2, { chainName: 'cosmoshub' })
		expect(networkResolver.projections.name(caip2Snapshot)).toBe('Cosmos Hub')
		expect(networkResolver.projections.name(slugSnapshot)).toBe('Cosmos Hub')
		expect(networkResolver.projections.environment(caip2Snapshot)).toBe(NetworkEnvironment.Mainnet)
		expect(slugSnapshot).toEqual(caip2Snapshot)

		const caip2Assets = nativeAssetsResolver.projections.$$nativeAssets(
			await nativeAssetsResolver.resolve.Caip2.resolve(
				caip2Network,
				resolverContext
			)
		)
		const slugAssets = nativeAssetsResolver.projections.$$nativeAssets(
			await nativeAssetsResolver.resolve.Slug.resolve(
				slugNetwork,
				resolverContext
			)
		)
		expect(getAssetList).toHaveBeenCalledTimes(2)
		expect(getAssetList).toHaveBeenNthCalledWith(1, { chainName: 'cosmoshub' })
		expect(getAssetList).toHaveBeenNthCalledWith(2, { chainName: 'cosmoshub' })
		expect(caip2Assets).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: caip2Network,
				kind: AssetInstanceKind.Denom,
				assetKey: 'uatom',
			},
			name: 'Cosmos Hub Atom',
			symbol: 'ATOM',
			decimals: 6,
		}])
		expect(slugAssets).toEqual([{
			...caip2Assets[0],
			[EntityMetaKey.Selector]: {
				...caip2Assets[0][EntityMetaKey.Selector],
				$network: slugNetwork,
			},
		}])
	})

	it('resolves direct asset fields for either parent selector and rejects foreign networks before I/O', async () => {
		const resolve = assetResolver.resolve.NetworkKindAssetKey.resolve
		const caip2Asset = await resolve({
			$network: caip2Network,
			kind: AssetInstanceKind.Denom,
			assetKey: 'uatom',
		}, resolverContext)
		const slugAsset = await resolve({
			$network: slugNetwork,
			kind: AssetInstanceKind.Denom,
			assetKey: 'uatom',
		}, resolverContext)
		expect(slugAsset).toEqual(caip2Asset)
		expect(getAssetList).toHaveBeenCalledTimes(2)

		await expect(networkResolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getChain).not.toHaveBeenCalled()
	})
})
