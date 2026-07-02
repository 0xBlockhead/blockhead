// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmCalldataSelector {
	Hex = 'Hex',
}
export default {
	entityType: EntityType.EvmCalldata,
	label: 'EVM calldata',
	labelPlural: 'EVM calldata',
	selectors: [
		{
			name: EvmCalldataSelector.Hex,
			fields: [
				'hex',
			],
		},
	],
	fields: [
		{
				name: 'hex',
				label: 'Hex',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
