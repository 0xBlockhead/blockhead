// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadQuilibriumAccountStateSelector {
	ConnectionIdNetworkAccountAddress = 'ConnectionIdNetworkAccountAddress',
}
export default {
	entityType: EntityType.BlockheadQuilibriumAccountState,
	label: 'blockhead quilibrium account state',
	labelPlural: 'blockhead quilibrium account states',
	selectors: [
		{
			name: BlockheadQuilibriumAccountStateSelector.ConnectionIdNetworkAccountAddress,
			fields: [
				'connectionId',
				'$network',
				'accountAddress',
			],
		},
	],
	fields: [
		{
				name: 'connectionId',
				label: 'connection ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.QuilibriumAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountAddress',
				label: 'account address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountKind',
				label: 'account kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'allowanceAddress',
				label: 'allowance address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signatureKeyAddress',
				label: 'signature key address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'keyRingRefCount',
				label: 'key ring ref count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$pendingTransactions',
				label: 'pending transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadQuilibriumPendingTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadQuilibriumAccountState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
