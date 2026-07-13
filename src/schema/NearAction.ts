// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearActionSelector {
	NearTransactionActionIndex = 'NearTransactionActionIndex',
}
export const NearAction = entity({
	entityType: EntityType.NearAction,
	labels: {
		singular: 'near action',
		plural: 'near actions',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	actionIndex: {
		label: 'Action index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		label: 'Action kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	methodName: {
		label: 'Method name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	depositYoctoNear: {
		label: 'Deposit yocto near',
		type: EntityFieldType.Primitive,
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
