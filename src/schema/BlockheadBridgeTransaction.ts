import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadBridgeTransactionSelector {
	AccountSourceTxCreatedAt = '$account+$sourceTx+createdAt',
}
export default {
	entityType: EntityType.BlockheadBridgeTransaction,
	label: 'blockhead bridge transaction',
	labelPlural: 'blockhead bridge transactions',
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
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$sourceTx',
			label: 'source transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$bridgeTransfer',
			label: 'bridge transfer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BridgeTransfer,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
