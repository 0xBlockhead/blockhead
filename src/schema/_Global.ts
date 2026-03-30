import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { type } from 'arktype'

export default {
	entityType: EntityType._Global,

	label: 'Global',

	id: type({}),

	fields: [
		
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
