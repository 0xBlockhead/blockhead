import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CodexDatasetSelector {
	Cid = 'cid',
}
export default {
	entityType: EntityType.CodexDataset,
	label: 'codex dataset',
	labelPlural: 'codex datasets',
	selectors: [
		{
			name: CodexDatasetSelector.Cid,
			fields: [
				'cid',
			],
		},
	],
	fields: [
		{
			name: 'cid',
			label: 'CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'treeCid',
			label: 'tree CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'datasetSizeBytes',
			label: 'dataset size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blockSizeBytes',
			label: 'block size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'filename',
			label: 'filename',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mimetype',
			label: 'mimetype',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$localCopies',
			label: 'local copies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCodexStoredData,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
