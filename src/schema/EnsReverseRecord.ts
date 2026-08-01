// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.EnsReverseRecord,
	labels: {
		singular: 'ENS reverse record',
		plural: 'ENS reverse records',
	},
})({
	$account: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.One,
	},
	$name: {
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.EnsReverseRecord_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountName: [
			'$account',
			'$name',
		],
	},
})
