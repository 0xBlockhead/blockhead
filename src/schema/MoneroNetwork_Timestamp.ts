// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroNetwork_TimestampSelector {
	NetworkTimestampMsSource = 'NetworkTimestampMsSource',
}
export default {
	entityType: EntityType.MoneroNetwork_Timestamp,
	label: 'monero network timestamp',
	labelPlural: 'monero network observations',
	selectors: [
		{
			name: MoneroNetwork_TimestampSelector.NetworkTimestampMsSource,
			fields: [
				'$network',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'height',
				label: 'Height',
				description: 'The block height.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'targetHeight',
				label: 'Target height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'topBlockHash',
				label: 'Top block hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'difficulty',
				label: 'Difficulty',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'wideDifficulty',
				label: 'Wide difficulty',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'cumulativeDifficulty',
				label: 'Cumulative difficulty',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'wideCumulativeDifficulty',
				label: 'Wide cumulative difficulty',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'blockSizeLimit',
				label: 'Block size limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'blockSizeMedian',
				label: 'Block size median',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'blockWeightLimit',
				label: 'Block weight limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'blockWeightMedian',
				label: 'Block weight median',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'databaseSize',
				label: 'Database size',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'freeSpace',
				label: 'Free space',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'greyPeerlistSize',
				label: 'Grey peerlist size',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'whitePeerlistSize',
				label: 'White peerlist size',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'incomingConnections',
				label: 'Incoming connections',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'outgoingConnections',
				label: 'Outgoing connections',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'txCount',
				label: 'Transaction count',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'txPoolSize',
				label: 'Transaction pool size',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'altBlocksCount',
				label: 'Alt blocks',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'targetSeconds',
				label: 'Target seconds',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'rpcConnections',
				label: 'RPC connections',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'mainnet',
				label: 'Mainnet',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'nettype',
				label: 'Network type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'offline',
				label: 'Offline',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'synchronized',
				label: 'Synchronized',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'wasBootstrapEverUsed',
				label: 'Bootstrap ever used',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'version',
				label: 'Version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.MoneroDaemonRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
