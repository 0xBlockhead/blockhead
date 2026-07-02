// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadStateChannelSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadStateChannel,
	label: 'blockhead state channel',
	labelPlural: 'blockhead state channels',
	selectors: [
		{
			name: BlockheadStateChannelSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$participant0',
				label: 'Participant 0',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$participant1',
				label: 'Participant 1',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$asset',
				label: 'Asset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$room',
				label: 'Room',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadRoom,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadStateChannel_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transfers',
				label: 'Transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadStateChannelTransfer,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
				name: '$$states',
				label: 'States',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadStateChannelState,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
				name: '$$deposits',
				label: 'Deposits',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadStateChannelDeposit,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
