// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaAllowance,
	labels: {
		singular: 'hedera allowance',
		plural: 'hedera allowances',
	},
})({
	$owner: {
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$spender: {
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	allowanceKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serialNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$nft: {
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.HederaAllowance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		OwnerSpenderAllowanceKind: [
			'$owner',
			'$spender',
			'allowanceKind',
		],
		OwnerSpenderAllowanceKindTokenId: [
			'$owner',
			'$spender',
			'allowanceKind',
			'tokenId',
		],
		OwnerSpenderAllowanceKindTokenIdSerialNumber: [
			'$owner',
			'$spender',
			'allowanceKind',
			'tokenId',
			'serialNumber',
		],
	},
})
