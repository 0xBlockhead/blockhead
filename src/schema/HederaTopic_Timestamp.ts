// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaTopic_Timestamp,
	labels: {
		singular: 'hedera topic timestamp',
		plural: 'hedera topic observations',
	},
})({
	$topic: {
		label: 'topic',
		entityType: EntityType.HederaTopic,
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
	memo: {
		label: 'memo',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	adminKey: {
		label: 'admin key',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	submitKey: {
		label: 'submit key',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	autoRenewAccountId: {
		label: 'auto renew account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	autoRenewPeriodSeconds: {
		label: 'auto renew period seconds',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeScheduleKey: {
		label: 'fee schedule key',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeExemptKeys: {
		label: 'fee exempt keys',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	customFees: {
		label: 'custom fees',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequenceNumber: {
		label: 'sequence number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runningHash: {
		label: 'running hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TopicTimestampMsSource: [
			'$topic',
			'timestampMs',
			'source',
		],
	},
})
