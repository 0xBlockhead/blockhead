// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmErrorSelector {
	Hex = 'Hex',
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
			label: 'Hex',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signatures',
			label: 'Signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmError_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
