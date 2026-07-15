// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadStateChannelSelector {
	Id = 'Id',
}
export const BlockheadStateChannel = entity({
	entityType: EntityType.BlockheadStateChannel,
	labels: {
		singular: 'blockhead state channel',
		plural: 'blockhead state channels',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$participant0: {
		label: 'Participant 0',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$participant1: {
		label: 'Participant 1',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'Asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'Room',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadStateChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'Transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadStateChannelTransfer,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$states: {
		label: 'States',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadStateChannelState,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$deposits: {
		label: 'Deposits',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadStateChannelDeposit,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
