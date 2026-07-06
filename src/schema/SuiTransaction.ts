// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiTransactionSelector {
	NetworkDigest = 'NetworkDigest',
}
export default {
	entityType: EntityType.SuiTransaction,
	label: 'sui transaction',
	labelPlural: 'sui transactions',
	selectors: [
		{
			name: SuiTransactionSelector.NetworkDigest,
			fields: [
				'$network',
				'digest',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'digest',
			label: 'digest',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionKind',
			label: 'transaction kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sender',
			label: 'sender',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiTransaction_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$commands',
			label: 'commands',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiProgrammableTransactionCommand,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$objectChanges',
			label: 'object changes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiObjectChange,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$balanceChanges',
			label: 'balance changes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiBalanceChange,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$events',
			label: 'events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiEvent,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
