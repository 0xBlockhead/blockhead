import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'

const {
	getEventEntries,
	getFourbyteEventEntries,
	getFourbyteFunctionEntries,
	getFunctionEntries,
} = vi.hoisted(() => ({
	getEventEntries: vi.fn(),
	getFourbyteEventEntries: vi.fn(),
	getFourbyteFunctionEntries: vi.fn(),
	getFunctionEntries: vi.fn(),
}))

vi.mock('$/sources/Openchain/Rest/queries.ts', () => ({
	getEventEntries,
	getFourbyteEventEntries,
	getFourbyteFunctionEntries,
	getFunctionEntries,
}))

const { default: openchain } = await import('$/resolvers/Openchain-Rest.ts')

describe('Openchain resolver', () => {
	const resolveSelector = async () => {
		const resolver = openchain.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmSelector
		))
		if (resolver == null)
			throw new Error('Openchain REST spec missing selector resolver')

		return resolver.resolve['Hex'].resolve({
			hex: '0x12345678',
		})
	}

	it('projects Openchain names at the resolver boundary', async () => {
		getFunctionEntries.mockResolvedValue([{ name: 'openchain(uint256)' }])

		const snapshot = await resolveSelector()

		expect(snapshot.signatures).toEqual([
			'openchain(uint256)',
		])
		expect(getFunctionEntries).toHaveBeenCalledWith({
			hex: '0x12345678',
		})
		expect(getFourbyteFunctionEntries).not.toHaveBeenCalled()
	})

	it('projects native 4byte text signatures only when Openchain has no rows', async () => {
		getFunctionEntries.mockResolvedValue([])
		getFourbyteFunctionEntries.mockResolvedValue([{ text_signature: 'fourbyte(address)' }])

		const snapshot = await resolveSelector()

		expect(snapshot.signatures).toEqual([
			'fourbyte(address)',
		])
		expect(getFourbyteFunctionEntries).toHaveBeenCalledWith({
			hex: '0x12345678',
		})
	})

	it('propagates provider failures instead of materializing false empty results', async () => {
		getFunctionEntries.mockRejectedValueOnce(new Error('Openchain unavailable'))

		await expect(resolveSelector()).rejects.toThrow('Openchain unavailable')

		getEventEntries.mockResolvedValueOnce([])
		getFourbyteEventEntries.mockRejectedValueOnce(new Error('4byte unavailable'))
		const resolver = openchain.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTopic
		))
		if (resolver == null)
			throw new Error('Openchain REST spec missing topic resolver')

		await expect(resolver.resolve['Hex'].resolve({
			hex: '0x12345678',
		})).rejects.toThrow('4byte unavailable')
	})
})
