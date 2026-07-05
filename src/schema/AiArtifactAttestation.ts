// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AiArtifactAttestationSelector {
	ArtifactAttestationKindLogEntryId = 'ArtifactAttestationKindLogEntryId',
	ArtifactAttestationKindSignatureHashAlgorithmSignatureHash = 'ArtifactAttestationKindSignatureHashAlgorithmSignatureHash',
}
export default {
	entityType: EntityType.AiArtifactAttestation,
	label: 'AI artifact attestation',
	labelPlural: 'AI artifact attestations',
	selectors: [
		{
			name: AiArtifactAttestationSelector.ArtifactAttestationKindLogEntryId,
			fields: [
				'$artifact',
				'attestationKind',
				'logEntryId',
			],
		},
		{
			name: AiArtifactAttestationSelector.ArtifactAttestationKindSignatureHashAlgorithmSignatureHash,
			fields: [
				'$artifact',
				'attestationKind',
				'signatureHashAlgorithm',
				'signatureHash',
			],
		},
	],
	fields: [
		{
				name: '$artifact',
				label: 'artifact',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AiArtifact,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'attestationKind',
				label: 'attestation kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'logEntryId',
				label: 'log entry ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signatureHashAlgorithm',
				label: 'signature hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signatureHash',
				label: 'signature hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'certificateIdentity',
				label: 'certificate identity',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'certificateIssuer',
				label: 'certificate issuer',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'logIndex',
				label: 'log index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'integratedTime',
				label: 'integrated time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bundle',
				label: 'bundle',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'payload',
				label: 'payload',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
