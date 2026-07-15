// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaAllowanceSelector {
	OwnerSpenderAllowanceKindTokenIdSerialNumber = 'OwnerSpenderAllowanceKindTokenIdSerialNumber',
}
export const HederaAllowance = entity({
	entityType: EntityType.HederaAllowance,
	labels: {
		singular: 'hedera allowance',
		plural: 'hedera allowances',
	},
})({
	$owner: {
		label: 'owner',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$spender: {
		label: 'spender',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	allowanceKind: {
		label: 'allowance kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serialNumber: {
		label: 'serial number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$nft: {
		label: 'NFT',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaAllowance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		OwnerSpenderAllowanceKindTokenIdSerialNumber: [
			'$owner',
			'$spender',
			'allowanceKind',
			'tokenId',
			'serialNumber',
		],
	},
})
