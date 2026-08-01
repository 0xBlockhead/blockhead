// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	tokenId: {
		label: 'Token ID',
		description: 'The token identifier within its collection or contract.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		label: 'transfer index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	serialNumber: {
		label: 'serial number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isApproval: {
		label: 'is approval',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$nft: {
		label: 'NFT',
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
