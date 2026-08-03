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
	entityType: EntityType.MoneroBlock,
	labels: {
		singular: 'monero block',
		plural: 'monero blocks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		entityType: EntityType.MoneroBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
			Source.ThreeXpl_Rest,
		],
	},
	difficulty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	weightBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	$$transactions: {
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
})({
	selectors: {
		NetworkHeight: [
			'$network',
			'height',
		],
		NetworkHeightHash: [
			'$network',
			'height',
			'hash',
		],
	},
})
