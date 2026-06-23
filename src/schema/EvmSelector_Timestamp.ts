import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmSelector_TimestampSelector {
	SelectorTimestampMsSource = '$selector+timestampMs+source',
}
export default {
	entityType: EntityType.EvmSelector_Timestamp,
	label: 'EVM selector timestamp',
	labelPlural: 'EVM selector observations',
	selectors: [
		{
			name: EvmSelector_TimestampSelector.SelectorTimestampMsSource,
			fields: [
				'$selector',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$selector',
			label: 'selector',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmSelector,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'signatures',
			label: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'filteredSignatureCount',
			label: 'filtered signature count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedCandidateCount',
			label: 'verified candidate count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reachable',
			label: 'reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
