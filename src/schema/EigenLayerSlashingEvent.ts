// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EigenLayerSlashingEventSelector {
	NetworkTransactionHashLogIndex = 'NetworkTransactionHashLogIndex',
	OperatorAvsSourceSlashId = 'OperatorAvsSourceSlashId',
}
export default {
	entityType: EntityType.EigenLayerSlashingEvent,
	label: 'eigen layer slashing event',
	labelPlural: 'eigen layer slashing events',
	selectors: [
		{
			name: EigenLayerSlashingEventSelector.NetworkTransactionHashLogIndex,
			fields: [
				'$network',
				'transactionHash',
				'logIndex',
			],
		},
		{
			name: EigenLayerSlashingEventSelector.OperatorAvsSourceSlashId,
			fields: [
				'$operator',
				'$avs',
				'source',
				'slashId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionHash',
			label: 'transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'logIndex',
			label: 'log index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slashId',
			label: 'slash ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$operator',
			label: 'operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerOperator,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$avs',
			label: 'AVS',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerAvs,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$strategy',
			label: 'strategy',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerStrategy,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slashedShares',
			label: 'slashed shares',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slashedAmount',
			label: 'slashed amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reason',
			label: 'reason',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
