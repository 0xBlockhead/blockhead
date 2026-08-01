// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenVersion: {
		label: 'token version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	encodedToken: {
		label: 'encoded token',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unit: {
		label: 'unit',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'memo',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mintUrl: {
		label: 'mint URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		label: 'mint',
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofCount: {
		label: 'proof count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalAmount: {
		label: 'total amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	importedAt: {
		label: 'imported AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	redeemedAt: {
		label: 'redeemed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$proofs: {
		label: 'proofs',
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
