// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandTealProgram_TimestampSelector {
	ProgramTimestampMsSource = 'ProgramTimestampMsSource',
}
export default {
	entityType: EntityType.AlgorandTealProgram_Timestamp,
	label: 'algorand teal program timestamp',
	labelPlural: 'algorand teal program observations',
	selectors: [
		{
			name: AlgorandTealProgram_TimestampSelector.ProgramTimestampMsSource,
			fields: [
				'$program',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$program',
				label: 'program',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AlgorandTealProgram,
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
				name: 'bytecode',
				label: 'bytecode',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'disassembly',
				label: 'disassembly',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceMap',
				label: 'source map',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'compileResultHash',
				label: 'compile result hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
