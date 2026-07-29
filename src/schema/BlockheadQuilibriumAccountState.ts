// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.One,
	},
	accountAddress: {
		label: 'account address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountKind: {
		label: 'account kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allowanceAddress: {
		label: 'allowance address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureKeyAddress: {
		label: 'signature key address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keyRingRefCount: {
		label: 'key ring ref count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$pendingTransactions: {
		label: 'pending transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadQuilibriumPendingTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
