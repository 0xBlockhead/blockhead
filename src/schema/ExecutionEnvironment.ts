import { type } from 'arktype'
import { ExecutionEnvironmentId } from '$/constants/ExecutionEnvironment.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.ExecutionEnvironment,

	label: 'Execution environment',
	labelPlural: 'Execution environments',

	id: type({
		executionEnvironmentId: type.valueOf(ExecutionEnvironmentId),
	}),

	fields: [
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
