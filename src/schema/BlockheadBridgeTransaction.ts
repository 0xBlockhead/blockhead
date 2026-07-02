// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadBridgeTransactionSelector {
	AccountSourceTxCreatedAt = 'AccountSourceTxCreatedAt',
}
export default {
	entityType: EntityType.BlockheadBridgeTransaction,
	label: 'bridge transaction',
	labelPlural: 'bridge transactions',
	selectors: [
		{
			name: BlockheadBridgeTransactionSelector.AccountSourceTxCreatedAt,
			fields: [
				'$account',
				'$sourceTx',
				'createdAt',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$sourceTx',
				label: 'Source transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$bridgeTransfer',
				label: 'Bridge transfer',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BridgeTransfer,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
