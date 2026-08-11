import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getEventEntries,
	getFourbyteEventEntries,
	getFourbyteFunctionEntries,
	getFunctionEntries,
	summarizeOpenchainEntries,
} = vi.hoisted(() => ({
	getEventEntries: vi.fn(),
	getFourbyteEventEntries: vi.fn(),
	getFourbyteFunctionEntries: vi.fn(),
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
	getFourbyteEventEntries,
	getFourbyteFunctionEntries,
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

	it('materializes complete selector observations in the parent row', async () => {
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

		const snapshot = await resolveSelector()
		expect(snapshot.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$selector: { hex: '0x12345678' },
				timestampMs: expect.any(Number),
				source: Source.Openchain_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'signatures')]: [
					'transfer(address,uint256)',
				],
				[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'filteredSignatureCount')]: 1,
				[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'verifiedCandidateCount')]: 1,
				[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'reachable')]: true,
			},
		}])
	})

	it('does not expose arbitrary selector, topic, or error timestamp facets', () => {
		expect(openchain.resolvers.some((candidate) => (
			candidate.entityType === EntityType.EvmSelector_Timestamp
			|| candidate.entityType === EntityType.EvmTopic_Timestamp
			|| candidate.entityType === EntityType.EvmError_Timestamp
		))).toBe(false)
	})
})
