// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadStateChannelTransferSelector {
	ChannelTurnNumFromToAmount = 'ChannelTurnNumFromToAmount',
}
export default {
	entityType: EntityType.BlockheadStateChannelTransfer,
	label: 'blockhead state channel transfer',
	labelPlural: 'blockhead state channel transfers',
	selectors: [
		{
			name: BlockheadStateChannelTransferSelector.ChannelTurnNumFromToAmount,
			fields: [
				'$channel',
				'turnNum',
				'$from',
				'$to',
				'amount',
			],
		},
	],
	fields: [
		{
				name: '$channel',
				label: 'channel',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadStateChannel,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'turnNum',
				label: 'turn num',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$from',
				label: 'from',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$to',
				label: 'to',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'amount',
				label: 'amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestamp',
				label: 'timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
