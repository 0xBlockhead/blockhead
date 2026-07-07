// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoStakePoolSelector {
	NetworkPoolId = 'NetworkPoolId',
}
export default {
	entityType: EntityType.CardanoStakePool,
	label: 'cardano stake pool',
	labelPlural: 'cardano stake pools',
	selectors: [
		{
			name: CardanoStakePoolSelector.NetworkPoolId,
			fields: [
				'$network',
				'poolId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'poolId',
			label: 'pool ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'vrfKeyHash',
			label: 'vrf key hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoStakePool_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
