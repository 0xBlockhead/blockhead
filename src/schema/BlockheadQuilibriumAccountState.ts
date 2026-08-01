// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadQuilibriumAccountState,
	labels: {
		singular: 'blockhead quilibrium account state',
		plural: 'blockhead quilibrium account states',
	},
})({
	connectionId: {
		label: 'connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		label: 'account address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allowanceAddress: {
		label: 'allowance address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureKeyAddress: {
		label: 'signature key address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyRingRefCount: {
		label: 'key ring ref count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$pendingTransactions: {
		label: 'pending transactions',
		entityType: EntityType.BlockheadQuilibriumPendingTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadQuilibriumAccountState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdNetworkAccountAddress: [
			'connectionId',
			'$network',
			'accountAddress',
		],
	},
})
