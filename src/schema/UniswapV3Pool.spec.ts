import { expect, it } from 'vitest'

import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import UniswapV3Pool from '$/schema/UniswapV3Pool.ts'

it.each([
	{ name: 'fee', valid: [0, 750, 999_999], invalid: [-1, 0.5, 1_000_000] },
	{ name: 'tickSpacing', valid: [1, 10, 16_383], invalid: [0, 0.5, 16_384] },
])('models the factory bounds of $name', ({ name, valid, invalid }) => {
	const field = UniswapV3Pool.fields.find((candidate) => candidate.name === name)
	if (field == null || field.type !== EntityFieldType.Primitive)
		throw new Error(`Missing primitive pool field ${name}`)
	expect(field.cardinality).toBe(EntityFieldCardinality.One)
	for (const value of valid)
		expect(field.primitiveType.allows(value)).toBe(true)
	for (const value of invalid)
		expect(field.primitiveType.allows(value)).toBe(false)
})
