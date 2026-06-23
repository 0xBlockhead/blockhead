import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosNetworkSelector {
	Network = 'network',
}
export default {
	entityType: EntityType.CosmosNetwork,
	label: 'Cosmos network',
	labelPlural: 'Cosmos networks',
	selectors: [
		{
			name: CosmosNetworkSelector.Network,
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
			name: 'restEndpoints',
			label: 'REST endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({"url": "string", "transportType": "string", "providerName": "string"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$validators',
			label: 'validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosValidator,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$governanceProposals',
			label: 'governance proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposal,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$denoms',
			label: 'denoms',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosDenom,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$modules',
			label: 'modules',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosModule,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
