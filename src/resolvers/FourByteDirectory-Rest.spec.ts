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
	it('returns stable parent output across repeated selector resolutions', async () => {
		getFunctionEntries.mockResolvedValue([{ text_signature: 'transfer(address,uint256)' }])
		const resolveSelector = () => resolverFor(EntityType.EvmSelector).resolve['Hex'].resolve({
			hex: '0xa9059cbb',
		})
		const first = await resolveSelector()
		const second = await resolveSelector()

		expect(first).toEqual({ signatures: ['transfer(address,uint256)'] })
		expect(first).not.toHaveProperty('$$timestamps')
		expect(second).toEqual(first)
	})

	it('keeps topic and error claims under the same explicit source', async () => {
		getEventEntries.mockResolvedValue([{ text_signature: 'Transfer(address,address,uint256)' }])
		getFunctionEntries.mockResolvedValue([
			{ text_signature: 'transfer(address,uint256)' },
			{ text_signature: 'Unauthorized(address)' },
		])

		const topic = await resolverFor(EntityType.EvmTopic).resolve['Hex'].resolve({ hex: '0x1234' })
		const error = await resolverFor(EntityType.EvmError).resolve['Hex'].resolve({ hex: '0x12345678' })

		expect(topic).toEqual({ signatures: ['Transfer(address,address,uint256)'] })
		expect(error.signatures).toEqual(['Unauthorized(address)'])
	})

	it('propagates provider failures and exposes no arbitrary timestamp facet', async () => {
		getFunctionEntries.mockRejectedValue(new Error('4byte.directory unavailable'))

		await expect(resolverFor(EntityType.EvmSelector).resolve['Hex'].resolve({
			hex: '0xa9059cbb',
		})).rejects.toThrow('4byte.directory unavailable')
	})
})
