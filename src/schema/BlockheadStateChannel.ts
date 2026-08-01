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
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$participant0: {
		label: 'Participant 0',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$participant1: {
		label: 'Participant 1',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'Asset',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'Room',
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.BlockheadStateChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transfers: {
		label: 'Transfers',
		entityType: EntityType.BlockheadStateChannelTransfer,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$states: {
		label: 'States',
		entityType: EntityType.BlockheadStateChannelState,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$deposits: {
		label: 'Deposits',
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
