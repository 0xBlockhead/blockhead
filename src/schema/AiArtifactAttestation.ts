// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.One,
	},
	attestationKind: {
		label: 'attestation kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logEntryId: {
		label: 'log entry ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHashAlgorithm: {
		label: 'signature hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHash: {
		label: 'signature hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certificateIdentity: {
		label: 'certificate identity',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certificateIssuer: {
		label: 'certificate issuer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	integratedTime: {
		label: 'integrated time',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bundle: {
		label: 'bundle',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
		label: 'payload',
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
