// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroOutputStateSelector {
	WalletIdTxHashOutputIndex = 'WalletIdTxHashOutputIndex',
}
export const BlockheadMoneroOutputState = entity({
	entityType: EntityType.BlockheadMoneroOutputState,
	labels: {
		singular: 'blockhead monero output state',
		plural: 'blockhead monero output states',
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
	$stealthOutput: {
		label: 'stealth output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroStealthOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txHash: {
		label: 'Transaction hash',
		description: 'The transaction hash in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'output index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
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
	keyImage: {
		label: 'key image',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyImageSignature: {
		label: 'key image signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	globalOutputIndex: {
		label: 'global output index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
