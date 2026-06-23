import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadCodexStoredDataSelector {
	NodeStateCid = '$nodeState+cid',
}
export default {
	entityType: EntityType.BlockheadCodexStoredData,
	label: 'blockhead codex stored data',
	labelPlural: 'blockhead codex stored datas',
	selectors: [
		{
			name: BlockheadCodexStoredDataSelector.NodeStateCid,
			fields: [
				'$nodeState',
				'cid',
			],
		},
	],
	fields: [
		{
			name: '$nodeState',
			label: 'node state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadCodexStorageNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'cid',
			label: 'CID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$dataset',
			label: 'dataset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CodexDataset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'firstSeenAt',
			label: 'first seen AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadCodexStoredData_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
