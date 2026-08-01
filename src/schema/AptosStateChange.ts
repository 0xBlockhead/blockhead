// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosStateChange,
	labels: {
		singular: 'aptos state change',
		plural: 'aptos state changes',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.AptosTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	changeIndex: {
		label: 'change index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	changeKind: {
		label: 'change kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateKeyHash: {
		label: 'state key hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resourceType: {
		label: 'resource type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleAddress: {
		label: 'module address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleName: {
		label: 'module name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$resource: {
		label: 'resource',
		entityType: EntityType.AptosAccountResource,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$module: {
		label: 'module',
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionChangeIndex: [
			'$transaction',
			'changeIndex',
		],
	},
})
