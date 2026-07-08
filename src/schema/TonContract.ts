// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TonContractSelector {
	Account = 'Account',
}
export const TonContract = entity({
	entityType: EntityType.TonContract,
	label: 'ton contract',
	labelPlural: 'ton contracts',
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TonAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$getMethods: {
		label: 'get methods',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TonContractGetMethod,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Account: [
			'$account',
		],
	},
})
