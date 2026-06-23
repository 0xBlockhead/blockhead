import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Eip8004AgentRegistrationFileSelector {
	RegistrationContentHashAlgorithmContentHash = '$registration+contentHashAlgorithm+contentHash',
	Artifact = '$artifact',
}
export default {
	entityType: EntityType.Eip8004AgentRegistrationFile,
	label: 'eip8004 agent registration file',
	labelPlural: 'eip8004 agent registration files',
	selectors: [
		{
			name: Eip8004AgentRegistrationFileSelector.RegistrationContentHashAlgorithmContentHash,
			fields: [
				'$registration',
				'contentHashAlgorithm',
				'contentHash',
			],
		},
		{
			name: Eip8004AgentRegistrationFileSelector.Artifact,
			fields: [
				'$artifact',
			],
		},
	],
	fields: [
		{
			name: '$registration',
			label: 'registration',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistration,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contentHashAlgorithm',
			label: 'content hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contentHash',
			label: 'content hash',
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
			name: 'fetchedAt',
			label: 'fetched AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'type',
			label: 'Type',
			description: 'The source-domain type or category.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'image',
			label: 'image',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'active',
			label: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'x402Support',
			label: 'x402 support',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supportedTrust',
			label: 'supported trust',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$serviceEndpoints',
			label: 'service endpoints',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Eip8004AgentServiceEndpoint,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$crossRegistrations',
			label: 'cross registrations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Eip8004CrossRegistration,
			cardinality: EntityFieldCardinality.Many,
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
