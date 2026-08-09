// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoveModule_Timestamp,
	labels: {
		singular: 'move module timestamp',
		plural: 'move module observations',
	},
})({
	$module: {
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageVersion: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageDigest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bytecode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abi: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceCode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceDigest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$functions: {
		entityType: EntityType.MoveFunction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$structs: {
		entityType: EntityType.MoveStruct,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ModuleTimestampMsSource: [
			'$module',
			'timestampMs',
			'source',
		],
	},
})
