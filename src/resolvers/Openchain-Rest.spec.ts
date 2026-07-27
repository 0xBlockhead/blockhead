import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'

const getFunctionEntries = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Openchain/Rest/queries.ts', () => ({
	getErrorEntries: vi.fn(),
	getEventEntries: vi.fn(),
	getFunctionEntries,
}))

const { default: openchain } = await import('$/resolvers/Openchain-Rest.ts')

describe('Openchain resolver', () => {
	it('maps selector requests through the source query', async () => {
		getFunctionEntries.mockResolvedValue([])

		const resolver = openchain.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmSelector
		))
		if (resolver == null)
			throw new Error('Openchain REST spec missing selector resolver')

		await resolver.resolve['Hex'].resolve({
			hex: '0x12345678',
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(getFunctionEntries).toHaveBeenCalledWith({
			hex: '0x12345678',
		})
	})
})
