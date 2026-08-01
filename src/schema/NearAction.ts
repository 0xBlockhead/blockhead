// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

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
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	methodName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	depositYoctoNear: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NearTransactionActionIndex: [
			'$transaction',
			'actionIndex',
		],
	},
})
