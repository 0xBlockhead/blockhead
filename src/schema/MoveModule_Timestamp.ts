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
		label: 'module',
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		label: 'ledger version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageVersion: {
		label: 'package version',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageDigest: {
		label: 'package digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bytecode: {
		label: 'bytecode',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abi: {
		label: 'ABI',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceCode: {
		label: 'source code',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceDigest: {
		label: 'source digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$functions: {
		label: 'functions',
		entityType: EntityType.MoveFunction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$structs: {
		label: 'structs',
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
