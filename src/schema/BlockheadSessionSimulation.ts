import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadSessionSimulationStatus {
	Success = 'success',
	Failed = 'failed',
}

export default {
	entityType: EntityType.BlockheadSessionSimulation,

	label: 'Session Simulation',
	labelPlural: 'Session Simulations',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: '$session',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSession,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BlockheadSessionSimulationStatus),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'paramsHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'result',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
