import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum GitRefSelector {
	RepositoryRefName = '$repository+refName',
}
export default {
	entityType: EntityType.GitRef,
	label: 'Git ref',
	labelPlural: 'Git refs',
	selectors: [
		{
			name: GitRefSelector.RepositoryRefName,
			fields: [
				'$repository',
				'refName',
			],
		},
	],
	fields: [
		{
			name: '$repository',
			label: 'repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRepository,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'refName',
			label: 'ref name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'refKind',
			label: 'ref kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetObjectId',
			label: 'target object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'symbolicTarget',
			label: 'symbolic target',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$observations',
			label: 'observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.GitRefObservation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
