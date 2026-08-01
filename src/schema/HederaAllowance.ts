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
		label: 'owner',
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$spender: {
		label: 'spender',
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	allowanceKind: {
		label: 'allowance kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serialNumber: {
		label: 'serial number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$nft: {
		label: 'NFT',
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
