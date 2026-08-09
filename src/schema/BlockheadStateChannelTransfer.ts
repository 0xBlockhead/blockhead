// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadStateChannelTransfer,
	labels: {
		singular: 'blockhead state channel transfer',
		plural: 'blockhead state channel transfers',
	},
})({
	$channel: {
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	turnNum: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$to: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	timestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ChannelTurnNumFromToAmount: [
			'$channel',
			'turnNum',
			'$from',
			'$to',
			'amount',
		],
	},
})
