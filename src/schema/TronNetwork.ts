import { type } from 'arktype'

import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum TronNetworkSelector {
	Network = 'network',
}


const tronRestEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.TronNetwork,

	label: 'TRON network',
	labelPlural: 'TRON networks',

	selectors: [
		{
			name: TronNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],

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
			primitiveType: tronRestEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
		{
			name: '$$witnesses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronWitness,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
