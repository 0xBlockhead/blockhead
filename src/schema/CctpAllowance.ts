import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.CctpAllowance,

	label: 'CCTP Allowance',
	labelPlural: 'CCTP Allowances',

	id: type({
		apiHost: 'string',
	}),

	fields: [
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
