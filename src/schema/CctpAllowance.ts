// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CctpAllowanceSelector {
	ApiHost = 'ApiHost',
}
export default {
	entityType: EntityType.CctpAllowance,
	label: 'CCTP allowance',
	labelPlural: 'CCTP allowances',
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
			label: 'API host',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allowance',
			label: 'Allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fetchedAt',
			label: 'Fetched at',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
