import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosNetworkSelector {
	Network = '$network',
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
