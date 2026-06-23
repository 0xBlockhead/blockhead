import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AlgorandNetworkSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.AlgorandNetwork,
	label: 'algorand network',
	labelPlural: 'algorand networks',
	selectors: [
		{
			name: AlgorandNetworkSelector.Network,
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
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$rounds',
			label: 'rounds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandRound,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandAsset,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$applications',
			label: 'applications',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandApplication,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AlgorandNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
