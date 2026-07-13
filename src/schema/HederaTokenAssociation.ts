// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTokenAssociationSelector {
	AccountToken = 'AccountToken',
}
export const HederaTokenAssociation = entity({
	entityType: EntityType.HederaTokenAssociation,
	labels: {
		singular: 'hedera token association',
		plural: 'hedera token associations',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$token: {
		label: 'token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaToken,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTokenAssociation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountToken: [
			'$account',
			'$token',
		],
	},
})
