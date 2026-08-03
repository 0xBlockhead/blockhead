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
	entityType: EntityType.MoneroTransaction,
	labels: {
		singular: 'monero transaction',
		plural: 'monero transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.MoneroBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	version: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	unlockTime: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	feeAtomicUnits: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	$$keyImages: {
		entityType: EntityType.MoneroKeyImage,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	$$stealthOutputs: {
		entityType: EntityType.MoneroStealthOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
})({
	selectors: {
		NetworkTxHash: [
			'$network',
			'txHash',
		],
	},
})
