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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	revision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	documentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureThreshold: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedSignatureCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		entityType: EntityType.GitSignature,
		cardinality: EntityFieldCardinality.Many,
	},
	$repository: {
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
