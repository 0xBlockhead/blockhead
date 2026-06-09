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

const zeroGEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.ZeroGNetwork,

	label: '0G network',
	labelPlural: '0G networks',

	id: type({
		networkSlug: type.unit('0g'),
	}),

	fields: [
		networkFields[0],
		networkFields[1],
		networkFields[2],
		networkFields[3],
		networkFields[11],
		networkFields[12],
		networkFields[13],
		networkFields[14],
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
			name: 'chainId',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: zeroGEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'explorerEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: zeroGEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'storageEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: zeroGEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$executionNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$consensusNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.ZeroGChainScan_Rest,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: '$$storageNodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageNode,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: '$$dataBlobs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
