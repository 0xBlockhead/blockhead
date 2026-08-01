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
		label: 'deposit',
		entityType: EntityType.BlockheadStateChannelDeposit,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	availableBalance: {
		label: 'available balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedBalance: {
		label: 'locked balance',
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
