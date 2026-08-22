// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmSelector,
	labels: {
		singular: 'EVM selector',
		plural: 'EVM selectors',
	},
})({
	hex: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	signatures: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Hex: [
			'hex',
		],
	},
})
