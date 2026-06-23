import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
export enum EvmErrorSelector {
	Hex = 'hex',
}
export default {
	entityType: EntityType.EvmError,
	label: 'EVM error',
	labelPlural: 'EVM errors',
	selectors: [
		{
			name: EvmErrorSelector.Hex,
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
			entityType: EntityType.EvmError_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
