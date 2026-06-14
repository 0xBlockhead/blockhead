import { type } from 'arktype'
import { ExecutionEnvironmentId } from '$/constants/ExecutionEnvironment.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ExecutionEnvironmentSelector {
	ExecutionEnvironmentId = 'executionEnvironmentId',
}

export default {
	entityType: EntityType.ExecutionEnvironment,

	label: 'Execution environment',
	labelPlural: 'Execution environments',

	selectors: [
		{
			name: ExecutionEnvironmentSelector.ExecutionEnvironmentId,
			fields: [
				'executionEnvironmentId',
			],
		},
	],

	fields: [
		{
			name: 'executionEnvironmentId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ExecutionEnvironmentId),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
