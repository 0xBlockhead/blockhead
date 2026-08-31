import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'

const getCategoryMetadata = vi.fn()

vi.mock('$/sources/BitcoinCashBcmr/Github/queries.ts', () => ({
	getCategoryMetadata,
}))

const { default: bitcoinCashBcmrResolvers } = await import('$/resolvers/BitcoinCashBcmr-Github.ts')

const [metadataResolver] = bitcoinCashBcmrResolvers.resolvers

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('BitcoinCashBcmr metadata resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects enrolled name/symbol/decimals from as-of category metadata', async () => {
		getCategoryMetadata.mockResolvedValueOnce({
			revision: '2026-06-01T00:00:00.000Z',
			snapshot: {
				name: 'Example Token',
				description: 'CashToken metadata',
				token: {
					category: 'a'.repeat(64),
					symbol: 'EX',
					decimals: 8,
				},
			},
		})

		const snapshot = await metadataResolver.resolve.NetworkCategoryIdRegistryUrl.resolve({
			$network: {
				caip2: networkBySlug['bitcoin-cash'].caip2,
			},
			categoryId: 'a'.repeat(64),
			registryUrl: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
		}, resolverContext)

		expect(metadataResolver.projections.name(snapshot)).toBe('Example Token')
		expect(metadataResolver.projections.symbol(snapshot)).toBe('EX')
		expect(metadataResolver.projections.decimals(snapshot)).toBe(8)
		expect(getCategoryMetadata).toHaveBeenCalledWith({
			url: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
			categoryId: 'a'.repeat(64),
		})
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(metadataResolver.resolve.NetworkCategoryIdRegistryUrl.resolve({
			$network: {
				slug: networkBySlug.bitcoin.slug,
			},
			categoryId: 'a'.repeat(64),
			registryUrl: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getCategoryMetadata).not.toHaveBeenCalled()
	})
})
