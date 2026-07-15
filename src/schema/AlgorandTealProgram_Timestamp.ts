// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandTealProgram_TimestampSelector {
	ProgramTimestampMsSource = 'ProgramTimestampMsSource',
}
export const AlgorandTealProgram_Timestamp = entity({
	entityType: EntityType.AlgorandTealProgram_Timestamp,
	labels: {
		singular: 'algorand teal program timestamp',
		plural: 'algorand teal program observations',
	},
})({
	$program: {
		label: 'program',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandTealProgram,
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
	bytecode: {
		label: 'bytecode',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disassembly: {
		label: 'disassembly',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceMap: {
		label: 'source map',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	compileResultHash: {
		label: 'compile result hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProgramTimestampMsSource: [
			'$program',
			'timestampMs',
			'source',
		],
	},
})
