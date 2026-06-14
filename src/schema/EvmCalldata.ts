import { type } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum EvmCalldataSelector {
	Hex = 'hex',
}

export default {
	entityType: EntityType.EvmCalldata,

	label: 'EVM Calldata',
	labelPlural: 'EVM Calldata',

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
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
