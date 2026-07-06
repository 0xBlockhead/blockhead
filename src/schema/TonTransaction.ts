// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonTransactionSelector {
	AccountLt = 'AccountLt',
	AccountLtHash = 'AccountLtHash',
}
export default {
	entityType: EntityType.TonTransaction,
	label: 'ton transaction',
	labelPlural: 'ton transactions',
	selectors: [
		{
			name: TonTransactionSelector.AccountLt,
			fields: [
				'$account',
				'lt',
			],
		},
		{
			name: TonTransactionSelector.AccountLtHash,
			fields: [
				'$account',
				'lt',
				'hash',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lt',
			label: 'lt',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nowMs',
			label: 'now ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'origStatus',
			label: 'orig status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endStatus',
			label: 'end status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionKind',
			label: 'transaction kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outMessageCount',
			label: 'out message count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalFeesNano',
			label: 'total fees nano',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previousTransactionHash',
			label: 'previous transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previousTransactionLt',
			label: 'previous transaction lt',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$trace',
			label: 'trace',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonTrace,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$inMessage',
			label: 'in message',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$outMessages',
			label: 'out messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$phases',
			label: 'phases',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonTransactionPhase,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
