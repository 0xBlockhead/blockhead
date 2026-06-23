import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AcpAgentRuntimeSelector {
	RuntimeId = 'runtimeId',
}
export default {
	entityType: EntityType.AcpAgentRuntime,
	label: 'acp agent runtime',
	labelPlural: 'acp agent runtimes',
	selectors: [
		{
			name: AcpAgentRuntimeSelector.RuntimeId,
			fields: [
				'runtimeId',
			],
		},
	],
	fields: [
		{
			name: 'runtimeId',
			label: 'runtime ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSource,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$programVersion',
			label: 'program version',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpAgentProgramVersion,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$programInstall',
			label: 'program install',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentProgramInstall,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transportKind',
			label: 'transport kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'processId',
			label: 'process ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'initializedAt',
			label: 'initialized AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$sessions',
			label: 'sessions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpSession,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AcpAgentRuntime_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
