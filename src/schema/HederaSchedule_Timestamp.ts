// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'schedule',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaSchedule,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	executedTimestamp: {
		label: 'executed timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationTime: {
		label: 'expiration time',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	waitForExpiry: {
		label: 'wait for expiry',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signatureCount: {
		label: 'signature count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$executionTransaction: {
		label: 'execution transaction',
		type: EntityFieldType.EntityReference,
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
