import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const cctpFeeRow = type({
	finalityThreshold: 'number',
	minimumFee: 'number',
})

export default {
	entityType: EntityType.CctpFee,

	label: 'CCTP Fee',

	id: type({
		apiHost: 'string',
		fromDomain: 'number',
		toDomain: 'number',
	}),

	fields: [
		{
			name: 'rows',
			type: EntityFieldType.Primitive,
			primitiveType: cctpFeeRow.array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fetchedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'isLoading',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
