import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getUsage = vi.hoisted(() => vi.fn())
const readUsageCredits = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Dune/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Dune/Rest/queries.ts')>(),
	getUsage,
	readUsageCredits,
}))

const { default: duneRest } = await import('$/resolvers/Dune-Rest.ts')

const emptyContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_DUNE_API_KEY: 'test-dune-key',
	},
}

describe('Dune_Rest _Global usage resolver', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		getUsage.mockReset()
		readUsageCredits.mockReset()
	})

	it('maps billing credits into schema-shaped _Global fields', async () => {
		const usage = {
			billingPeriods: [{ credits_used: 12, credits_included: 1000 }],
		}
		getUsage.mockResolvedValue(usage)
		readUsageCredits.mockReturnValue({
			credits_used: 12,
			credits_included: 1000,
		})

		const resolvers: readonly { entityType: EntityType }[] = duneRest.resolvers
		const resolver = resolvers.find((candidate) => (
			candidate.entityType === EntityType._Global
		))
		if (resolver == null)
			throw new Error('Dune_Rest: missing _Global resolver')

		const snapshot = await resolver.resolve.Scope.resolve(
			{ scope: '_Global' },
			emptyContext
		)

		expect(duneRest.source).toBe(Source.Dune_Rest)
		expect(getUsage).toHaveBeenCalledWith(emptyContext.publicEnv, {})
		expect(readUsageCredits).toHaveBeenCalledWith(usage)
		expect(snapshot).toEqual({
			duneCreditsUsed: 12,
			duneCreditsIncluded: 1000,
		})
		expect(resolver.projections.duneCreditsUsed(snapshot)).toBe(12)
		expect(resolver.projections.duneCreditsIncluded(snapshot)).toBe(1000)
	})

	it('omits absent optional credit fields while keeping present ones', async () => {
		getUsage.mockResolvedValue({
			billing_periods: [{ credits_used: 4 }],
		})
		readUsageCredits.mockReturnValue({ credits_used: 4 })

		const resolver = duneRest.resolvers[0]
		const snapshot = await resolver.resolve.Scope.resolve(
			{ scope: '_Global' },
			emptyContext
		)

		expect(snapshot).toEqual({
			duneCreditsUsed: 4,
		})
		expect(resolver.projections.duneCreditsUsed(snapshot)).toBe(4)
		expect(resolver.projections.duneCreditsIncluded(snapshot)).toBeUndefined()
	})

	it('hard-fails missing billing credits instead of soft-emptying', async () => {
		getUsage.mockResolvedValue({})
		readUsageCredits.mockImplementation(() => {
			throw new Error('Dune_Rest: usage response missing billing credits')
		})

		await expect(duneRest.resolvers[0].resolve.Scope.resolve(
			{ scope: '_Global' },
			emptyContext
		)).rejects.toThrow('missing billing credits')
	})

	it('propagates usage HTTP failures', async () => {
		getUsage.mockRejectedValue(new Error('Dune API (401): unauthorized'))

		await expect(duneRest.resolvers[0].resolve.Scope.resolve(
			{ scope: '_Global' },
			emptyContext
		)).rejects.toThrow(/401/)
		expect(readUsageCredits).not.toHaveBeenCalled()
	})
})
