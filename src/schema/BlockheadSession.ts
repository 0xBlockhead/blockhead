import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BlockheadSessionStatus {
	Draft = 'Draft',
	Submitted = 'Submitted',
	Finalized = 'Finalized',
}

export default {
	entityType: EntityType.BlockheadSession,

	label: 'Session',

	id: type({
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
