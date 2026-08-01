// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarTrustline,
	labels: {
		singular: 'stellar trustline',
		plural: 'stellar trustlines',
	},
})({
	$account: {
		label: 'account',
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'asset',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.StellarTrustline_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountAsset: [
			'$account',
			'$asset',
		],
	},
})
