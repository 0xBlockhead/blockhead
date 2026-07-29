// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoneroNetwork_Timestamp,
	labels: {
		singular: 'monero network timestamp',
		plural: 'monero network observations',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		label: 'Height',
		description: 'The block height.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	targetHeight: {
		label: 'Target height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	topBlockHash: {
		label: 'Top block hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	difficulty: {
		label: 'Difficulty',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	wideDifficulty: {
		label: 'Wide difficulty',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	cumulativeDifficulty: {
		label: 'Cumulative difficulty',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	wideCumulativeDifficulty: {
		label: 'Wide cumulative difficulty',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	blockSizeLimit: {
		label: 'Block size limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	blockSizeMedian: {
		label: 'Block size median',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	blockWeightLimit: {
		label: 'Block weight limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	blockWeightMedian: {
		label: 'Block weight median',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	databaseSize: {
		label: 'Database size',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	freeSpace: {
		label: 'Free space',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	greyPeerlistSize: {
		label: 'Grey peerlist size',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	whitePeerlistSize: {
		label: 'White peerlist size',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	incomingConnections: {
		label: 'Incoming connections',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	outgoingConnections: {
		label: 'Outgoing connections',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	txCount: {
		label: 'Transaction count',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	txPoolSize: {
		label: 'Transaction pool size',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	altBlocksCount: {
		label: 'Alt blocks',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	targetSeconds: {
		label: 'Target seconds',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	rpcConnections: {
		label: 'RPC connections',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	mainnet: {
		label: 'Mainnet',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	nettype: {
		label: 'Network type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	offline: {
		label: 'Offline',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	synchronized: {
		label: 'Synchronized',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	wasBootstrapEverUsed: {
		label: 'Bootstrap ever used',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkTimestampMsSource: [
			'$network',
			'timestampMs',
			'source',
		],
	},
})
