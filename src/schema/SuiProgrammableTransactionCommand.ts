// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiProgrammableTransactionCommand,
	labels: {
		singular: 'sui programmable transaction command',
		plural: 'sui programmable transaction commands',
	},
})({
	$transaction: {
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	commandIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	commandKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	packageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	functionName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	typeArguments: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	arguments: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionCommandIndex: [
			'$transaction',
			'commandIndex',
		],
	},
})
