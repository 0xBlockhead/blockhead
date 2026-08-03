// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const moneroDaemonRpcJsonRpcSources = [
	Source.MoneroDaemonRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.MoneroNetwork_Timestamp,
	labels: {
		singular: 'monero network timestamp',
		plural: 'monero network observations',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	targetHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	topBlockHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	difficulty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	wideDifficulty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	cumulativeDifficulty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	wideCumulativeDifficulty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	blockSizeLimit: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	blockSizeMedian: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	blockWeightLimit: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	blockWeightMedian: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	databaseSize: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	freeSpace: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	greyPeerlistSize: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	whitePeerlistSize: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	incomingConnections: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	outgoingConnections: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	txCount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	txPoolSize: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	altBlocksCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	targetSeconds: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	rpcConnections: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	mainnet: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	nettype: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	offline: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	synchronized: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	wasBootstrapEverUsed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
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
