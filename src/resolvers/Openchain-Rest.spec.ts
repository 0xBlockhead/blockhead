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

	it('projects filtered/verified counts on selector timestamp observations', async () => {
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

		const resolver = openchain.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmSelector_Timestamp
		))
		if (resolver == null)
			throw new Error('Openchain REST spec missing selector timestamp resolver')

		const snapshot = await resolver.resolve['SelectorTimestampMsSource'].resolve({
			$selector: { hex: '0xa9059cbb' },
			timestampMs: 1,
			source: 'Openchain_Rest',
		})

		expect(snapshot).toMatchObject({
			signatures: [
				'transfer(address,uint256)',
			],
			filteredSignatureCount: 1,
			verifiedCandidateCount: 1,
			reachable: true,
		})
	})

	it('records unreachable topic observations without inventing empty-success HTTP', async () => {
		getEventEntries.mockRejectedValueOnce(new Error('Openchain down'))

		const resolver = openchain.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTopic_Timestamp
		))
		if (resolver == null)
			throw new Error('Openchain REST spec missing topic timestamp resolver')

		await expect(resolver.resolve['TopicTimestampMsSource'].resolve({
			$topic: { hex: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' },
			timestampMs: 1,
			source: 'Openchain_Rest',
		})).resolves.toEqual({
			signatures: [],
			reachable: false,
		})
	})
})
