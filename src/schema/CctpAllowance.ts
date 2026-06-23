import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CctpAllowanceSelector {
	ApiHost = 'apiHost',
}
export default {
	entityType: EntityType.CctpAllowance,
	label: 'cctp allowance',
	labelPlural: 'cctp allowances',
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allowance',
			label: 'allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type("number | null"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fetchedAt',
			label: 'fetched AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
