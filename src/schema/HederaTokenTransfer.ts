// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaTokenTransfer,
	labels: {
		singular: 'hedera token transfer',
		plural: 'hedera token transfers',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		label: 'transfer index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serialNumber: {
		label: 'serial number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isApproval: {
		label: 'is approval',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$nft: {
		label: 'NFT',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionTokenIdAccountIdTransferIndex: [
			'$transaction',
			'tokenId',
			'accountId',
			'transferIndex',
		],
	},
})
