import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MoneroNetwork_TimestampSelector {
	NetworkTimestampMs = 'networkTimestampMs',
}
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.MoneroNetwork_Timestamp,

	label: 'Monero network snapshot',
	labelPlural: 'Monero network snapshots',

	selectors: [
		{
			name: MoneroNetwork_TimestampSelector.NetworkTimestampMs,
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
			name: 'height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'targetHeight',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'topBlockHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'difficulty',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'wideDifficulty',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'cumulativeDifficulty',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'wideCumulativeDifficulty',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'blockSizeLimit',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'blockSizeMedian',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'blockWeightLimit',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'blockWeightMedian',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'databaseSize',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'freeSpace',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'greyPeerlistSize',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'whitePeerlistSize',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'incomingConnections',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'outgoingConnections',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'txCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'txPoolSize',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'altBlocksCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'targetSeconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'rpcConnections',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'mainnet',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'nettype',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'offline',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'synchronized',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'wasBootstrapEverUsed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
