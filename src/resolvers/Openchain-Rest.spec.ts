import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'

const {
	getEventEntries,
	getFunctionEntries,
	summarizeOpenchainEntries,
} = vi.hoisted(() => ({
	getEventEntries: vi.fn(),
	getFunctionEntries: vi.fn(),
	summarizeOpenchainEntries: vi.fn((entries: { name: string, filtered?: boolean, hasVerifiedContract?: boolean }[]) => {
		const unfiltered = entries.filter((entry) => entry.filtered !== true)
		return {
			signatures: (
				unfiltered.length > 0 ?
					unfiltered
				:
					entries
			)
				.map((entry) => entry.name),
			filteredSignatureCount: entries.filter((entry) => entry.filtered === true).length,
			verifiedCandidateCount: entries.filter((entry) => entry.hasVerifiedContract === true).length,
		}
	}),
}))

vi.mock('$/sources/Openchain/Rest/queries.ts', () => ({
	getEventEntries,
	getFunctionEntries,
	summarizeOpenchainEntries,
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
		getFunctionEntries.mockResolvedValue([
			{
				name: 'openchain(uint256)',
				filtered: false,
				hasVerifiedContract: true,
			},
		])

		const snapshot = await resolveSelector()

		expect(snapshot.signatures).toEqual([
			'openchain(uint256)',
		])
		expect(getFunctionEntries).toHaveBeenCalledWith({
			hex: '0x12345678',
		})
	})

	it('propagates provider failures instead of materializing false empty results', async () => {
		getFunctionEntries.mockRejectedValueOnce(new Error('Openchain unavailable'))

		await expect(resolveSelector()).rejects.toThrow('Openchain unavailable')

		getEventEntries.mockRejectedValueOnce(new Error('Openchain event lookup unavailable'))
		const resolver = openchain.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTopic
		))
		if (resolver == null)
			throw new Error('Openchain REST spec missing topic resolver')

		await expect(resolver.resolve['Hex'].resolve({
			hex: '0x12345678',
		})).rejects.toThrow('Openchain event lookup unavailable')
	})

	it('returns stable parent output across repeated selector resolutions', async () => {
		getFunctionEntries.mockResolvedValue([
			{
				name: 'transfer(address,uint256)',
				filtered: false,
				hasVerifiedContract: true,
			},
			{
				name: 'spam(uint256)',
				filtered: true,
				hasVerifiedContract: false,
			},
		])

		const first = await resolveSelector()
		const second = await resolveSelector()
		expect(first).toEqual({ signatures: ['transfer(address,uint256)'] })
		expect(first).not.toHaveProperty('$$timestamps')
		expect(second).toEqual(first)
	})

})
