// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadMoneroOutputState,
	labels: {
		singular: 'blockhead monero output state',
		plural: 'blockhead monero output states',
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
	$stealthOutput: {
		label: 'stealth output',
		entityType: EntityType.MoneroStealthOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'output index',
		primitiveType: type('number'),
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
	keyImage: {
		label: 'key image',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyImageSignature: {
		label: 'key image signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	globalOutputIndex: {
		label: 'global output index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadMoneroOutputState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdTxHashOutputIndex: [
			'walletId',
			'txHash',
			'outputIndex',
		],
	},
})
