import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const cctpFeeRow = type({
	finalityThreshold: 'number',
	minimumFee: 'number',
})

export default {
	entityType: EntityType.CctpFee,

	label: 'CCTP Fee',
	labelPlural: 'CCTP Fees',

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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
