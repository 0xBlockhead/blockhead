import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BittensorNetwork_TimestampSelector {
	NetworkTimestampMs = 'networkTimestampMs',
}
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.BittensorNetwork_Timestamp,

	label: 'Bittensor network snapshot',
	labelPlural: 'Bittensor network snapshots',

	selectors: [
		{
			name: BittensorNetwork_TimestampSelector.NetworkTimestampMs,
			fields: [
				'$network',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'finalizedBlockNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'finalizedBlockHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'runtimeSpecName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'runtimeSpecVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'runtimeImplVersion',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'peerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'isSyncing',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'shouldHavePeers',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'subnetCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'subnetsInfoByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'dynamicInfoByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'metagraphsByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
