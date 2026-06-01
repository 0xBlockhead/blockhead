import { type } from 'arktype'

import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

const cosmosRestEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.CosmosNetwork,

	label: 'Cosmos network',
	labelPlural: 'Cosmos networks',

	id: Network.id,

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'restEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: cosmosRestEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: '$$validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosValidator,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
		{
			name: '$$governanceProposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposal,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.CosmosSdk_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
