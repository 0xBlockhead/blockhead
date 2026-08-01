// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmCalldata,
	labels: {
		singular: 'EVM calldata',
		plural: 'EVM calldata',
	},
})({
	hex: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Hex: [
			'hex',
		],
	},
})
