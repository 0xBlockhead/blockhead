// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.NearAction,
	labels: {
		singular: 'near action',
		plural: 'near actions',
	},
})({
	$transaction: {
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	actionIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: nearRpcJsonRpcSources,
	},
	methodName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	depositYoctoNear: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
})({
	selectors: {
		NearTransactionActionIndex: [
			'$transaction',
			'actionIndex',
		],
	},
})
