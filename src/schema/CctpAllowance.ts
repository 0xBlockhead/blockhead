import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum CctpAllowanceSelector {
	ApiHost = 'apiHost',
}

export default {
	entityType: EntityType.CctpAllowance,

	label: 'CCTP Allowance',
	labelPlural: 'CCTP Allowances',

	selectors: [
		{
			name: CctpAllowanceSelector.ApiHost,
			fields: [
				'apiHost',
			],
		},
	],

	fields: [
		{
			name: 'apiHost',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type('number | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fetchedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
