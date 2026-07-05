// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonMessageSelector {
	NetworkMessageHash = 'NetworkMessageHash',
	SourceTransactionOutIndex = 'SourceTransactionOutIndex',
}
export default {
	entityType: EntityType.TonMessage,
	label: 'ton message',
	labelPlural: 'ton messages',
	selectors: [
		{
			name: TonMessageSelector.NetworkMessageHash,
			fields: [
				'$network',
				'messageHash',
			],
		},
		{
			name: TonMessageSelector.SourceTransactionOutIndex,
			fields: [
				'$sourceTransaction',
				'outIndex',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TonNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'messageHash',
				label: 'message hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$sourceTransaction',
				label: 'source transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TonTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'outIndex',
				label: 'out index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'messageKind',
				label: 'message kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sourceAddress',
				label: 'source address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'destinationAddress',
				label: 'destination address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueNano',
				label: 'value nano',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdLt',
				label: 'created lt',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ihrDisabled',
				label: 'ihr disabled',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bounce',
				label: 'bounce',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bounced',
				label: 'bounced',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'opcode',
				label: 'opcode',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bodyHash',
				label: 'body hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stateInitHash',
				label: 'state init hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'cell',
				label: 'cell',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
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
				name: '$destinationTransaction',
				label: 'destination transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TonTransaction,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
