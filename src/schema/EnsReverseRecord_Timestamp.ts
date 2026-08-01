// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsReverseRecord_Timestamp,
	labels: {
		singular: 'ENS reverse record timestamp',
		plural: 'ENS reverse record observations',
	},
})({
	$reverseRecord: {
		label: 'Reverse record',
		entityType: EntityType.EnsReverseRecord,
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
	verified: {
		label: 'Verified',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverSelector: {
		label: 'Resolver selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ReverseRecordTimestampMsSource: [
			'$reverseRecord',
			'timestampMs',
			'source',
		],
	},
})
