// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadQuilibriumAccountState_Timestamp,
	labels: {
		singular: 'blockhead quilibrium account state timestamp',
		plural: 'blockhead quilibrium account state observations',
	},
})({
	$accountState: {
		label: 'account state',
		entityType: EntityType.BlockheadQuilibriumAccountState,
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
	balance: {
		label: 'balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	balanceObservedAt: {
		label: 'balance observed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountStateTimestampMsSource: [
			'$accountState',
			'timestampMs',
			'source',
		],
	},
})
