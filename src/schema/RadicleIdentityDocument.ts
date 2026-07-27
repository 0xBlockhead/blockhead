// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	revision: {
		label: 'revision',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	documentHash: {
		label: 'document hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payload: {
		label: 'payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureThreshold: {
		label: 'signature threshold',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedSignatureCount: {
		label: 'verified signature count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
		label: 'verification status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$signatures: {
		label: 'signatures',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.GitSignature,
		cardinality: EntityFieldCardinality.Many,
	},
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
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
