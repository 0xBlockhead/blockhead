// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuToken,
	labels: {
		singular: 'blockhead Cashu token',
		plural: 'blockhead Cashu tokens',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenVersion: {
		label: 'token version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	encodedToken: {
		label: 'encoded token',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unit: {
		label: 'unit',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'memo',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mintUrl: {
		label: 'mint URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		label: 'mint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofCount: {
		label: 'proof count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalAmount: {
		label: 'total amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	importedAt: {
		label: 'imported AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	redeemedAt: {
		label: 'redeemed AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$proofs: {
		label: 'proofs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
