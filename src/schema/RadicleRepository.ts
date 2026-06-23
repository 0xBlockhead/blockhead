import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum RadicleRepositorySelector {
	Rid = 'rid',
}
export default {
	entityType: EntityType.RadicleRepository,
	label: 'radicle repository',
	labelPlural: 'radicle repositories',
	selectors: [
		{
			name: RadicleRepositorySelector.Rid,
			fields: [
				'rid',
			],
		},
	],
	fields: [
		{
			name: 'rid',
			label: 'rid',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$gitRepository',
			label: 'Git repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRepository,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'visibility',
			label: 'visibility',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'defaultBranch',
			label: 'default branch',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$delegates',
			label: 'delegates',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RadicleDelegate,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$signedRefs',
			label: 'signed refs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RadicleSignedRef,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$issues',
			label: 'issues',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RadicleIssue,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$patches',
			label: 'patches',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RadiclePatch,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$seedObservations',
			label: 'seed observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
