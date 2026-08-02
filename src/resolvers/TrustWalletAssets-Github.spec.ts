import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'

const getChainLogoUrl = vi.hoisted(() => vi.fn((chain: string) => `https://assets.example/${chain}.png`))

vi.mock('$/sources/TrustWalletAssets/Github/queries.ts', () => ({
	getChainLogoUrl,
}))

const { default: trustWalletAssetsGithub } = await import('$/resolvers/TrustWalletAssets-Github.ts')
const [networkResolver, assetInstanceResolver] = trustWalletAssetsGithub.resolvers
const networkResolve = networkResolver.resolve
const assetInstanceResolve = assetInstanceResolver.resolve

if (
	!('Caip2' in networkResolve)
	|| !('Slug' in networkResolve)
	|| !('NetworkKindAssetKey' in assetInstanceResolve)
)
	throw new Error('TrustWallet network and native-asset resolvers must be registered')

describe('TrustWallet asset network catalog', () => {
	beforeEach(() => {
		getChainLogoUrl.mockClear()
	})

	it.each([
		[{ slug: 'bitcoin-cash' }, 'bitcoincash'],
		[{ caip2: { namespace: 'eip155', reference: '42220' } }, 'celo'],
		[{ caip2: { namespace: 'eip155', reference: '43114' } }, 'avalanchec'],
		[{ caip2: { namespace: 'eip155', reference: '1' } }, 'ethereum'],
		[{ caip2: { namespace: 'solana', reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' } }, 'solana'],
		[{ slug: 'solana' }, 'solana'],
	] as const)('maps %o to the %s asset directory', async (selector, chain) => {
		await (
			'slug' in selector ?
				networkResolve.Slug.resolve(selector)
			:
				networkResolve.Caip2.resolve(selector)
		)

		expect(getChainLogoUrl).toHaveBeenLastCalledWith(chain)
	})

	it('derives both resolver applicability surfaces from the same unique selector set', () => {
		expect(networkResolve.Caip2.resolve).toBe(networkResolve.Slug.resolve)
		expect(networkResolve.Caip2.appliesTo).toHaveLength(11)
		expect(networkResolve.Slug.appliesTo).toHaveLength(8)

		const networkSelectorKeys = [
			...networkResolve.Caip2.appliesTo,
			...networkResolve.Slug.appliesTo,
		].map((selector) => JSON.stringify(selector))
		const assetNetworkSelectorKeys = assetInstanceResolve.NetworkKindAssetKey.appliesTo
			.map(({ $network, kind }) => {
				expect(kind).toBe(AssetInstanceKind.Native)
				return JSON.stringify($network)
			})

		expect(new Set(networkSelectorKeys).size).toBe(19)
		expect(assetNetworkSelectorKeys.toSorted()).toEqual(networkSelectorKeys.toSorted())
	})

	it('rejects selectors outside the catalog', async () => {
		await expect(networkResolve.Slug.resolve({ slug: 'unmapped' })).rejects.toThrow('network not mapped')
		await expect(networkResolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '999999',
			},
		})).rejects.toThrow('network not mapped')
	})

	it('keeps native kind as part of asset identity', async () => {
		await expect(assetInstanceResolve.NetworkKindAssetKey.resolve({
			$network: { slug: 'bitcoin' },
			kind: AssetInstanceKind.Token,
			assetKey: 'BTC',
		})).rejects.toThrow('only native assets are mapped')
	})
})
