// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiArtifactAttestation,
	labels: {
		singular: 'AI artifact attestation',
		plural: 'AI artifact attestations',
	},
})({
	$artifact: {
		label: 'artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.One,
	},
	attestationKind: {
		label: 'attestation kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logEntryId: {
		label: 'log entry ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHashAlgorithm: {
		label: 'signature hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHash: {
		label: 'signature hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certificateIdentity: {
		label: 'certificate identity',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certificateIssuer: {
		label: 'certificate issuer',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	integratedTime: {
		label: 'integrated time',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bundle: {
		label: 'bundle',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ArtifactAttestationKindLogEntryId: [
			'$artifact',
			'attestationKind',
			'logEntryId',
		],
		ArtifactAttestationKindSignatureHashAlgorithmSignatureHash: [
			'$artifact',
			'attestationKind',
			'signatureHashAlgorithm',
			'signatureHash',
		],
	},
})
