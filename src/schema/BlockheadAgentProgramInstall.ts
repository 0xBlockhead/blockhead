import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentProgramInstallSelector {
	InstallId = 'installId',
}
export default {
	entityType: EntityType.BlockheadAgentProgramInstall,
	label: 'blockhead agent program install',
	labelPlural: 'blockhead agent program installs',
	selectors: [
		{
			name: BlockheadAgentProgramInstallSelector.InstallId,
			fields: [
				'installId',
			],
		},
	],
	fields: [
		{
			name: 'installId',
			label: 'install ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$programVersion',
			label: 'program version',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpAgentProgramVersion,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: 'installPath',
			label: 'install path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'command',
			label: 'command',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'argsHashAlgorithm',
			label: 'args hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'argsHash',
			label: 'args hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'environmentScope',
			label: 'environment scope',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadAgentProgramInstall_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
