// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarClaimableBalanceSelector {
	NetworkClaimableBalanceId = 'NetworkClaimableBalanceId',
}
export default {
	entityType: EntityType.StellarClaimableBalance,
	label: 'stellar claimable balance',
	labelPlural: 'stellar claimable balances',
	selectors: [
		{
			name: StellarClaimableBalanceSelector.NetworkClaimableBalanceId,
			fields: [
				'$network',
				'claimableBalanceId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'claimableBalanceId',
			label: 'claimable balance ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarClaimableBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
