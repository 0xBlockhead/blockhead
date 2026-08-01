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
		label: 'Transaction',
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	actionIndex: {
		label: 'Action index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		label: 'Action kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	methodName: {
		label: 'Method name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	depositYoctoNear: {
		label: 'Deposit yocto near',
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
