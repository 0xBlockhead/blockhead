import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmCalldataSelector {
	Hex = 'hex',
}
export default {
	entityType: EntityType.EvmCalldata,
	label: 'EVM calldata',
	labelPlural: 'EVM calldatas',
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
			label: 'hex',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
