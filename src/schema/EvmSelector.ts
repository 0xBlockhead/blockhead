import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
export enum EvmSelectorSelector {
	Hex = 'hex',
}
export default {
	entityType: EntityType.EvmSelector,
	label: 'EVM selector',
	labelPlural: 'EVM selectors',
	selectors: [
		{
			name: EvmSelectorSelector.Hex,
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
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmSelector_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
