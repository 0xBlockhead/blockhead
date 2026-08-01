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
		label: 'transaction',
		entityType: EntityType.SuiTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	commandIndex: {
		label: 'command index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	commandKind: {
		label: 'command kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	packageId: {
		label: 'package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleName: {
		label: 'module name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	functionName: {
		label: 'function name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	typeArguments: {
		label: 'type arguments',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	arguments: {
		label: 'arguments',
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
