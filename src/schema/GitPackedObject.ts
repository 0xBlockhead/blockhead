import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum GitPackedObjectSelector {
	PackHashObjectIdObjectFormat = 'packHash+objectId+objectFormat',
}
export default {
	entityType: EntityType.GitPackedObject,
	label: 'Git packed object',
	labelPlural: 'Git packed objects',
	selectors: [
		{
			name: GitPackedObjectSelector.PackHashObjectIdObjectFormat,
			fields: [
				'packHash',
				'objectId',
				'objectFormat',
			],
		},
	],
	fields: [
		{
			name: 'packHash',
			label: 'pack hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'objectId',
			label: 'object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'objectFormat',
			label: 'object format',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'offset',
			label: 'offset',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deltaBaseObjectId',
			label: 'delta base object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storedKind',
			label: 'stored kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$packfile',
			label: 'packfile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitPackfile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$object',
			label: 'object',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
