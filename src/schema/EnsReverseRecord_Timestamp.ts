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
		entityType: EntityType.EnsReverseRecord,
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
	verified: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resolverSelector: {
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
