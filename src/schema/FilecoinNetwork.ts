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
import { Source } from '$/sources/Source.ts'

export enum FilecoinNetworkSelector {
	Network = 'network',
}

const filecoinRpcEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.FilecoinNetwork,

	label: 'Filecoin network',
	labelPlural: 'Filecoin networks',

	selectors: [
		{
			name: FilecoinNetworkSelector.Network,
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
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: filecoinRpcEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: '$$tipsets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
