// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarTrustlineSelector {
	AccountAsset = 'AccountAsset',
}
export const StellarTrustline = entity({
	entityType: EntityType.StellarTrustline,
	labels: {
		singular: 'stellar trustline',
		plural: 'stellar trustlines',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
