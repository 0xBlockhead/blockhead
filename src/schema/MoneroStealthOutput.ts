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
	entityType: EntityType.MoneroStealthOutput,
	labels: {
		singular: 'monero stealth output',
		plural: 'monero stealth outputs',
	},
})({
	$transaction: {
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
	commitment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: moneroDaemonRpcJsonRpcSources,
	},
})({
	selectors: {
		MoneroTransactionOutputIndex: [
			'$transaction',
			'outputIndex',
		],
	},
})
