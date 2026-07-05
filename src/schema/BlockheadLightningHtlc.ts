// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadLightningHtlcSelector {
	ChannelStateHtlcIndex = 'ChannelStateHtlcIndex',
}
export default {
	entityType: EntityType.BlockheadLightningHtlc,
	label: 'blockhead Lightning htlc',
	labelPlural: 'blockhead Lightning htlcs',
	selectors: [
		{
			name: BlockheadLightningHtlcSelector.ChannelStateHtlcIndex,
			fields: [
				'$channelState',
				'htlcIndex',
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
				name: 'htlcIndex',
				label: 'htlc index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$channel',
				label: 'channel',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LightningChannel,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'direction',
				label: 'direction',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountMsat',
				label: 'amount msat',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expiryHeight',
				label: 'expiry height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'hashLock',
				label: 'hash lock',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'state',
				label: 'state',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
