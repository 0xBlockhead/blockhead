// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleIdentityDocument,
	labels: {
		singular: 'radicle identity document',
		plural: 'radicle identity documents',
	},
})({
	rid: {
		label: 'rid',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	revision: {
		label: 'revision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	documentHash: {
		label: 'document hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payload: {
		label: 'payload',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureThreshold: {
		label: 'signature threshold',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedSignatureCount: {
		label: 'verified signature count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
		label: 'verification status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		label: 'signatures',
		entityType: EntityType.GitSignature,
		cardinality: EntityFieldCardinality.Many,
	},
	$repository: {
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RidRevision: [
			'rid',
			'revision',
		],
	},
})
