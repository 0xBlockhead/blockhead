import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const fetchBrowseResult = vi.hoisted(() => vi.fn())
const parseArweaveManifest = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Arweave/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Arweave/Rest/queries.ts')>(),
	fetchBrowseResult,
	parseArweaveManifest,
}))

describe('Arweave manifest resolver', () => {
	it('materializes declared paths as canonical native resource children', async () => {
		fetchBrowseResult.mockResolvedValueOnce({
			contentType: 'application/x.arweave-manifest+json; charset=utf-8',
			text: '{}',
		})
		parseArweaveManifest.mockReturnValueOnce({
			manifest: 'arweave/paths',
			version: '0.2.0',
			index: { path: 'index.html' },
			fallback: { id: 'B'.repeat(43) },
			paths: {
				'index.html': { id: 'C'.repeat(43) },
				'assets/app.js': { id: 'D'.repeat(43) },
			},
		})
		const { default: arweaveRest } = await import('$/resolvers/Arweave-Rest.ts')
		const resolver = arweaveRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.ArweaveResource
			&& 'manifestVersion' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Arweave manifest resolver missing')

		const snapshot = await resolver.resolve.TransactionIdContentPath.resolve({
			transactionId: 'A'.repeat(43),
			contentPath: '',
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})

		expect(resolver.projections.manifestVersion(snapshot)).toBe('0.2.0')
		expect(resolver.projections.manifestIndexPath(snapshot)).toBe('index.html')
		expect(resolver.projections.manifestFallbackTransactionId(snapshot)).toBe('B'.repeat(43))
		expect(resolver.projections.$$manifestPaths.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					transactionId: 'A'.repeat(43),
					contentPath: 'index.html',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]:
						`ar://${'A'.repeat(43)}/index.html`,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					transactionId: 'A'.repeat(43),
					contentPath: 'assets/app.js',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.ArweaveResource, [], 'canonicalUri')]:
						`ar://${'A'.repeat(43)}/assets/app.js`,
				},
			},
		])
	})
})
