// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.MoneroNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		label: 'transfer index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	direction: {
		label: 'direction',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountIndex: {
		label: 'account index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addressIndex: {
		label: 'address index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountAtomicUnits: {
		label: 'amount atomic units',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeAtomicUnits: {
		label: 'fee atomic units',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentId: {
		label: 'payment ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	note: {
		label: 'note',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyImage: {
		label: 'key image',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
