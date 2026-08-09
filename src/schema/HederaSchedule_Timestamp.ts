// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaSchedule_Timestamp,
	labels: {
		singular: 'hedera schedule timestamp',
		plural: 'hedera schedule observations',
	},
})({
	$schedule: {
		entityType: EntityType.HederaSchedule,
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
	executedTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationTime: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	waitForExpiry: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$executionTransaction: {
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ScheduleTimestampMsSource: [
			'$schedule',
			'timestampMs',
			'source',
		],
	},
})
