// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconDeposit,
	labels: {
		singular: 'beacon deposit',
		plural: 'Beacon deposits',
	},
	description: 'A validator deposit included in an Ethereum beacon block.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInSlot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	pubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$validator: {
		entityType: EntityType.BeaconValidator,
		cardinality: EntityFieldCardinality.One,
	},
	withdrawalCredentials: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amountGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	proof: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkSlotIndexInSlot: [
			'$network',
			'slot',
			'indexInSlot',
		],
	},
})
