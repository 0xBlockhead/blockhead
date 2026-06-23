import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadCodexStoredData_TimestampSelector {
	StoredDataTimestampMsSource = '$storedData+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadCodexStoredData_Timestamp,
	label: 'blockhead codex stored data timestamp',
	labelPlural: 'blockhead codex stored data observations',
	selectors: [
		{
			name: BlockheadCodexStoredData_TimestampSelector.StoredDataTimestampMsSource,
			fields: [
				'$storedData',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$storedData',
			label: 'stored data',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadCodexStoredData,
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
			name: 'hasLocalBlock',
			label: 'has local block',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'availableLocally',
			label: 'available locally',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'downloadStatus',
			label: 'download status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
