// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLightningChannelState_TimestampSelector {
	ChannelStateTimestampMsSource = 'ChannelStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadLightningChannelState_Timestamp,
	label: 'blockhead Lightning channel state timestamp',
	labelPlural: 'blockhead Lightning channel state observations',
	selectors: [
		{
			name: BlockheadLightningChannelState_TimestampSelector.ChannelStateTimestampMsSource,
			fields: [
				'$channelState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$channelState',
			label: 'channel state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadLightningChannelState,
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
			name: 'localBalanceSats',
			label: 'local balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'remoteBalanceSats',
			label: 'remote balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unsettledBalanceSats',
			label: 'unsettled balance sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'active',
			label: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitFeeSats',
			label: 'commit fee sats',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitWeight',
			label: 'commit weight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feePerKw',
			label: 'fee per kw',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'numUpdates',
			label: 'num updates',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSyncedAt',
			label: 'last synced AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
