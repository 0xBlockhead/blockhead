// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsRecord,
	labels: {
		singular: 'ENS record',
		plural: 'ENS records',
	},
})({
	$name: {
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	recordKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	recordKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	coinType: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.EnsRecord_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NameRecordKey: [
			'$name',
			'recordKey',
		],
	},
})
