// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroTransferState,
	labels: {
		singular: 'blockhead monero transfer state',
		plural: 'blockhead monero transfer states',
	},
})({
	walletId: {
		label: 'wallet ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
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
	direction: {
		label: 'direction',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountIndex: {
		label: 'account index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addressIndex: {
		label: 'address index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountAtomicUnits: {
		label: 'amount atomic units',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeAtomicUnits: {
		label: 'fee atomic units',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentId: {
		label: 'payment ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	note: {
		label: 'note',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyImage: {
		label: 'key image',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadMoneroTransferState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdTxHashTransferIndex: [
			'walletId',
			'txHash',
			'transferIndex',
		],
	},
})
