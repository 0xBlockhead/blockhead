import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sourceGetJson } = vi.hoisted(() => ({
	sourceGetJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
}))

const { getCategoryMetadata } = await import('$/sources/BitcoinCashBcmr/Github/queries.ts')

const categoryId = 'a'.repeat(64)

describe('Bitcoin Cash BCMR metadata selection', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('selects the latest reached identity snapshot rather than registry latestRevision', async () => {
		sourceGetJson.mockResolvedValueOnce({
			latestRevision: '2026-07-01T00:00:00.000Z',
			identities: {
				[categoryId]: {
					'2025-01-01T00:00:00.000Z': {
						name: 'Old name',
						token: {
							category: categoryId,
							symbol: 'OLD',
							decimals: 2,
						},
					},
					'2026-06-01T00:00:00.000Z': {
						name: 'Current name',
						token: {
							category: categoryId,
							symbol: 'NOW',
							decimals: 8,
						},
					},
					'2027-01-01T00:00:00.000Z': {
						name: 'Planned name',
						token: {
							category: categoryId,
							symbol: 'NEXT',
							decimals: 8,
						},
					},
				},
			},
		})

		await expect(getCategoryMetadata({
			url: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
			categoryId,
			atTimestamp: '2026-07-22T00:00:00.000Z',
		})).resolves.toMatchObject({
			revision: '2026-06-01T00:00:00.000Z',
			snapshot: {
				name: 'Current name',
			},
		})
	})

	it('fails closed on undeclared origins, malformed revisions, and mismatched categories', async () => {
		await expect(getCategoryMetadata({
			url: 'https://example.com/registry.json',
			categoryId,
			atTimestamp: '2026-07-22T00:00:00.000Z',
		})).rejects.toThrow('declared GitHub source')
		expect(sourceGetJson).not.toHaveBeenCalled()

		sourceGetJson.mockResolvedValueOnce({
			identities: {
				[categoryId]: {
					tomorrow: {
						name: 'Invalid',
					},
				},
			},
		})
		await expect(getCategoryMetadata({
			url: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
			categoryId,
			atTimestamp: '2026-07-22T00:00:00.000Z',
		})).rejects.toThrow('revision timestamp')

		sourceGetJson.mockResolvedValueOnce({
			identities: {
				[categoryId]: {
					'2026-01-01T00:00:00.000Z': {
						token: {
							category: 'b'.repeat(64),
							symbol: 'WRONG',
						},
					},
				},
			},
		})
		await expect(getCategoryMetadata({
			url: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
			categoryId,
			atTimestamp: '2026-07-22T00:00:00.000Z',
		})).rejects.toThrow('does not match')
	})

	it('fails closed on malformed registry envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			latestRevision: 12,
			identities: [],
		})
		await expect(getCategoryMetadata({
			url: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
			categoryId,
			atTimestamp: '2026-07-22T00:00:00.000Z',
		})).rejects.toThrow('invalid registry response envelope')

		sourceGetJson.mockResolvedValueOnce({
			identities: {
				[categoryId]: {
					'2026-01-01T00:00:00.000Z': {
						token: {
							decimals: -1,
						},
					},
				},
			},
		})
		await expect(getCategoryMetadata({
			url: 'https://raw.githubusercontent.com/example/registry/main/registry.json',
			categoryId,
			atTimestamp: '2026-07-22T00:00:00.000Z',
		})).rejects.toThrow('invalid identity snapshot')
	})
})
