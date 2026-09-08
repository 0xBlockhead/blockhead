import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const { getEventEntries, getFunctionEntries } = vi.hoisted(() => ({
	getEventEntries: vi.fn(),
	getFunctionEntries: vi.fn(),
}))

vi.mock('$/sources/FourByteDirectory/Rest/queries.ts', () => ({
	getEventEntries,
	getFunctionEntries,
}))

const { default: catalog } = await import('$/resolvers/FourByteDirectory-Rest.ts')

const cases = [
	{
		entityType: EntityType.EvmSelector,
		hex: '0xa9059cbb',
		query: getFunctionEntries,
		signatures: [
			'transfer(address,uint256)',
			'work(uint256)',
		],
	},
	{
		entityType: EntityType.EvmTopic,
		hex: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
		query: getEventEntries,
		signatures: [
			'Transfer(address,address,uint256)',
			'Other(uint256)',
		],
	},
	{
		entityType: EntityType.EvmError,
		hex: '0x12345678',
		query: getFunctionEntries,
		signatures: [
			'Unauthorized(address)',
			'Error(string)',
			'Panic(uint256)',
		],
	},
] as const

const resolverFor = (entityType: EntityType) => {
	const resolver = catalog.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`FourByteDirectory spec missing ${entityType} resolver`)

	return resolver
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('FourByteDirectory signature claims', () => {
	it.each(cases)('deduplicates $entityType claims while preserving distinct signatures and order', async ({
		entityType,
		hex,
		query,
		signatures,
	}) => {
		query.mockResolvedValue([
			...signatures,
			signatures[0],
			...signatures,
		].map((text_signature) => ({ text_signature })))
		const resolver = resolverFor(entityType)
		const first = await resolver.resolve.Hex.resolve({ hex })
		const second = await resolver.resolve.Hex.resolve({ hex })

		expect(catalog.source).toBe(Source.FourByteDirectory_Rest)
		expect(first).toEqual({ signatures: [...signatures] })
		expect(second).toEqual(first)
		expect(query).toHaveBeenCalledWith({ hex })
		expect(query).toHaveBeenCalledTimes(2)
	})

	it.each(cases)('returns successful empty $entityType claims', async ({
		entityType,
		hex,
		query,
	}) => {
		query.mockResolvedValue([])
		await expect(resolverFor(entityType).resolve.Hex.resolve({ hex })).resolves.toEqual({
			signatures: [],
		})
	})

	it.each(cases)('propagates $entityType provider failures', async ({
		entityType,
		hex,
		query,
	}) => {
		const failure = new Error('FourByteDirectory unavailable')
		query.mockRejectedValueOnce(failure)
		await expect(resolverFor(entityType).resolve.Hex.resolve({ hex })).rejects.toBe(failure)
	})

	it('filters function names from errors and allows no matching errors', async () => {
		getFunctionEntries.mockResolvedValue([
			{ text_signature: 'transfer(address,uint256)' },
			{ text_signature: 'Unauthorized(address)' },
			{ text_signature: 'Unauthorized(address)' },
		])
		const resolve = () => resolverFor(EntityType.EvmError).resolve.Hex.resolve({
			hex: '0x12345678',
		})
		await expect(resolve()).resolves.toEqual({ signatures: ['Unauthorized(address)'] })

		getFunctionEntries.mockResolvedValue([{ text_signature: 'transfer(address,uint256)' }])
		await expect(resolve()).resolves.toEqual({ signatures: [] })
	})
})
