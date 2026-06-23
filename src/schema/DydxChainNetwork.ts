import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum DydxChainNetworkSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.DydxChainNetwork,
	label: 'dydx chain network',
	labelPlural: 'dydx chain networks',
	selectors: [
		{
			name: DydxChainNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$markets',
			label: 'markets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainMarket,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$subaccounts',
			label: 'subaccounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainSubaccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$orders',
			label: 'orders',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainOrder,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$positions',
			label: 'positions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
