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
	getFunctionEntries,
} = vi.hoisted(() => ({
	getEventEntries: vi.fn(),
	getFunctionEntries: vi.fn(),
}))

vi.mock('$/sources/FourByteDirectory/Rest/queries.ts', () => ({
	getEventEntries,
	getFunctionEntries,
}))

const { default: fourByteDirectory } = await import('$/resolvers/FourByteDirectory-Rest.ts')

const resolverFor = (entityType: EntityType) => {
	const resolver = fourByteDirectory.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`4byte.directory spec missing ${entityType} resolver`)

	return resolver
}

describe('4byte.directory resolver', () => {
	it('materializes source-owned selector observations', async () => {
		getFunctionEntries.mockResolvedValue([{ text_signature: 'transfer(address,uint256)' }])
		const snapshot = await resolverFor(EntityType.EvmSelector).resolve['Hex'].resolve({
			hex: '0xa9059cbb',
		})

		expect(snapshot).toEqual({
			signatures: ['transfer(address,uint256)'],
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$selector: { hex: '0xa9059cbb' },
					timestampMs: expect.any(Number),
					source: Source.FourByteDirectory_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'signatures')]: ['transfer(address,uint256)'],
					[entityFieldAddressKey(EntityType.EvmSelector_Timestamp, [], 'reachable')]: true,
				},
			}],
		})
	})

	it('keeps topic and error claims under the same explicit source', async () => {
		getEventEntries.mockResolvedValue([{ text_signature: 'Transfer(address,address,uint256)' }])
		getFunctionEntries.mockResolvedValue([
			{ text_signature: 'transfer(address,uint256)' },
			{ text_signature: 'Unauthorized(address)' },
		])

		const topic = await resolverFor(EntityType.EvmTopic).resolve['Hex'].resolve({ hex: '0x1234' })
		const error = await resolverFor(EntityType.EvmError).resolve['Hex'].resolve({ hex: '0x12345678' })

		expect(topic.$$timestamps[0]?.[EntityMetaKey.Selector].source).toBe(Source.FourByteDirectory_Rest)
		expect(error.signatures).toEqual(['Unauthorized(address)'])
		expect(error.$$timestamps[0]?.[EntityMetaKey.Selector].source).toBe(Source.FourByteDirectory_Rest)
	})

	it('propagates provider failures and exposes no arbitrary timestamp facet', async () => {
		getFunctionEntries.mockRejectedValue(new Error('4byte.directory unavailable'))

		await expect(resolverFor(EntityType.EvmSelector).resolve['Hex'].resolve({
			hex: '0xa9059cbb',
		})).rejects.toThrow('4byte.directory unavailable')
		expect(fourByteDirectory.resolvers.some((candidate) => (
			candidate.entityType === EntityType.EvmSelector_Timestamp
			|| candidate.entityType === EntityType.EvmTopic_Timestamp
			|| candidate.entityType === EntityType.EvmError_Timestamp
		))).toBe(false)
	})
})
