// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiObjectChange,
	labels: {
		singular: 'sui object change',
		plural: 'sui object changes',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.SuiTransaction,
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
	objectId: {
		label: 'object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	objectType: {
		label: 'object type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerSelector: {
		label: 'owner selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	digest: {
		label: 'digest',
		primitiveType: type('string'),
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
