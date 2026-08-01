// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EnsReverseRecord,
	labels: {
		singular: 'ENS reverse record',
		plural: 'ENS reverse records',
	},
})({
	$account: {
		label: 'Account',
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.One,
	},
	$name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
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
