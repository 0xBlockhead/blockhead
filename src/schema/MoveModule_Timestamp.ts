// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MoveModule_TimestampSelector {
	ModuleTimestampMsSource = 'ModuleTimestampMsSource',
}
export const MoveModule_Timestamp = entity({
	entityType: EntityType.MoveModule_Timestamp,
	labels: {
		singular: 'move module timestamp',
		plural: 'move module observations',
	},
})({
	$module: {
		label: 'module',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoveModule,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		label: 'ledger version',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageVersion: {
		label: 'package version',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	packageDigest: {
		label: 'package digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bytecode: {
		label: 'bytecode',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abi: {
		label: 'ABI',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceCode: {
		label: 'source code',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceDigest: {
		label: 'source digest',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$functions: {
		label: 'functions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MoveFunction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$structs: {
		label: 'structs',
		type: EntityFieldType.EntitiesReference,
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
