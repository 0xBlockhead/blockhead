// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLightningNodeState_TimestampSelector {
	LocalNodeStateTimestampMsSource = 'LocalNodeStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLightningNodeState_Timestamp,
	label: 'blockhead Lightning node state timestamp',
	labelPlural: 'blockhead Lightning node state observations',
	selectors: [
		{
			name: BlockheadLightningNodeState_TimestampSelector.LocalNodeStateTimestampMsSource,
			fields: [
				'$localNodeState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$localNodeState',
			label: 'local node state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLightningNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'syncedToChain',
			label: 'synced to chain',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'syncedToGraph',
			label: 'synced to graph',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockHeight',
			label: 'block height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bestHeaderTimestampMs',
			label: 'best header timestamp ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'walletBalanceSats',
			label: 'wallet balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'channelBalanceSats',
			label: 'channel balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pendingChannelBalanceSats',
			label: 'pending channel balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerCount',
			label: 'peer count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activeChannelCount',
			label: 'active channel count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inactiveChannelCount',
			label: 'inactive channel count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pendingChannelCount',
			label: 'pending channel count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
