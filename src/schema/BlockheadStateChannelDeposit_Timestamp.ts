// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
	labels: {
		singular: 'blockhead state channel deposit timestamp',
		plural: 'blockhead state channel deposit observations',
	},
})({
	$deposit: {
		entityType: EntityType.BlockheadStateChannelDeposit,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	availableBalance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedBalance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		DepositTimestampMsSource: [
			'$deposit',
			'timestampMs',
			'source',
		],
	},
})
