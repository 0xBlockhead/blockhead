// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarTrustlineSelector {
	AccountAsset = 'AccountAsset',
}
export default {
	entityType: EntityType.StellarTrustline,
	label: 'stellar trustline',
	labelPlural: 'stellar trustlines',
	selectors: [
		{
			name: StellarTrustlineSelector.AccountAsset,
			fields: [
				'$account',
				'$asset',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$asset',
				label: 'asset',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarAsset,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTrustline_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
