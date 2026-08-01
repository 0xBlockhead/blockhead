// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitSignature,
	labels: {
		singular: 'Git signature',
		plural: 'Git signatures',
	},
})({
	signatureId: {
		label: 'signature ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subjectObjectId: {
		label: 'subject object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	signatureKind: {
		label: 'signature kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signerSelector: {
		label: 'signer selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadHash: {
		label: 'payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
		label: 'verification status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	verifiedAtMs: {
		label: 'verified AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifier: {
		label: 'verifier',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUrl: {
		label: 'evidence URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SignatureId: [
			'signatureId',
		],
	},
})
