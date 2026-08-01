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
		label: 'channel',
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.One,
	},
	turnNum: {
		label: 'turn num',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'from',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$to: {
		label: 'to',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	timestamp: {
		label: 'timestamp',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
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
