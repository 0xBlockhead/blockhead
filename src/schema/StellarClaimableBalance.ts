// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarClaimableBalanceSelector {
	NetworkClaimableBalanceId = 'NetworkClaimableBalanceId',
}
export const StellarClaimableBalance = entity({
	entityType: EntityType.StellarClaimableBalance,
	label: 'stellar claimable balance',
	labelPlural: 'stellar claimable balances',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	claimableBalanceId: {
		label: 'claimable balance ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StellarClaimableBalance_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkClaimableBalanceId: [
			'$network',
			'claimableBalanceId',
		],
	},
})
