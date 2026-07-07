// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.TezosNetwork,
	label: 'tezos network',
	labelPlural: 'tezos networks',
	selectors: [
		{
			name: TezosNetworkSelector.Network,
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
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$operationGroups',
			label: 'operation groups',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosOperationGroup,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$operations',
			label: 'operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$bakers',
			label: 'bakers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBaker,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$cycles',
			label: 'cycles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosCycle,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$bakingRights',
			label: 'baking rights',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBakingRight,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokens',
			label: 'tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosToken,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$bigMaps',
			label: 'big maps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMap,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$bigMapKeys',
			label: 'big map keys',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMapKey,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$bigMapTimestamps',
			label: 'big map timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMap_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$bigMapKeyTimestamps',
			label: 'big map key timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMapKey_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenTransfers',
			label: 'token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
