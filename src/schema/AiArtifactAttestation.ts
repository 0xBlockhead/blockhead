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
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.One,
	},
	attestationKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logEntryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certificateIdentity: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certificateIssuer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	integratedTime: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bundle: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payload: {
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
