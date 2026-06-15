import { type } from 'arktype'

import { NetworkEnvironment } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { networkFields } from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum NearNetworkSelector {
	Slug = 'slug',
}


const nearRpcEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.NearNetwork,

	label: 'NEAR network',
	labelPlural: 'NEAR networks',

	selectors: [
		{
			name: NearNetworkSelector.Slug,
			fields: [
				'slug',
			],
		},
	],

	fields: [
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('near'),
			cardinality: EntityFieldCardinality.One,
		},
		networkFields[1],
		networkFields[2],
		networkFields[3],
		{
			name: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(NetworkEnvironment),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: nearRpcEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: '$$validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearValidator,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
