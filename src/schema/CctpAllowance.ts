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

	id: type({
		apiHost: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
