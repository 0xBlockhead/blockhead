import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AcpAgentProgramVersionSelector {
	ProgramVersion = '$program+version',
	Artifact = '$artifact',
}
export default {
	entityType: EntityType.AcpAgentProgramVersion,
	label: 'acp agent program version',
	labelPlural: 'acp agent program versions',
	selectors: [
		{
			name: AcpAgentProgramVersionSelector.ProgramVersion,
			fields: [
				'$program',
				'version',
			],
		},
		{
			name: AcpAgentProgramVersionSelector.Artifact,
			fields: [
				'$artifact',
			],
		},
	],
	fields: [
		{
			name: '$program',
			label: 'program',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AcpAgentProgram,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$artifact',
			label: 'artifact',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiArtifact,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'releaseDate',
			label: 'release date',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'distributionKind',
			label: 'distribution kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'distribution',
			label: 'distribution',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
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
			name: 'arguments',
			label: 'arguments',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'environmentKeys',
			label: 'environment keys',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$documents',
			label: 'documents',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiDocument,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
