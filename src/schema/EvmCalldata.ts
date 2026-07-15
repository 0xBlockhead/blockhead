// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmCalldataSelector {
	Hex = 'Hex',
}
export const EvmCalldata = entity({
	entityType: EntityType.EvmCalldata,
	labels: {
		singular: 'EVM calldata',
		plural: 'EVM calldata',
	},
})({
	hex: {
		label: 'Hex',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Hex: [
			'hex',
		],
	},
})
