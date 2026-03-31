import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BlockheadSessionSimulationStatus {
	Success = 'success',
	Failed = 'failed',
}

export default {
	entityType: EntityType.BlockheadSessionSimulation,

	label: 'Session Simulation',

	id: type({
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
