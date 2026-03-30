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
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
