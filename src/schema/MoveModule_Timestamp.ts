// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MoveModule_TimestampSelector {
	ModuleTimestampMsSource = 'ModuleTimestampMsSource',
}
export default {
	entityType: EntityType.MoveModule_Timestamp,
	label: 'move module timestamp',
	labelPlural: 'move module observations',
	selectors: [
		{
			name: MoveModule_TimestampSelector.ModuleTimestampMsSource,
			fields: [
				'$module',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$module',
				label: 'module',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.MoveModule,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'ledgerVersion',
				label: 'ledger version',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packageVersion',
				label: 'package version',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'packageDigest',
				label: 'package digest',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bytecode',
				label: 'bytecode',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'abi',
				label: 'ABI',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceCode',
				label: 'source code',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceDigest',
				label: 'source digest',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$functions',
				label: 'functions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoveFunction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$structs',
				label: 'structs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.MoveStruct,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
