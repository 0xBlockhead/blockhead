// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadStateChannel,
	labels: {
		singular: 'blockhead state channel',
		plural: 'blockhead state channels',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$participant0: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$participant1: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadStateChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		entityType: EntityType.BlockheadStateChannelTransfer,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$states: {
		entityType: EntityType.BlockheadStateChannelState,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$deposits: {
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
