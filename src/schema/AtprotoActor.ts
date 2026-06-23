import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AtprotoActorSelector {
	Did = 'did',
	Handle = 'handle',
}
export default {
	entityType: EntityType.AtprotoActor,
	label: 'atproto actor',
	labelPlural: 'atproto actors',
	selectors: [
		{
			name: AtprotoActorSelector.Did,
			fields: [
				'did',
			],
		},
		{
			name: AtprotoActorSelector.Handle,
			fields: [
				'handle',
			],
		},
	],
	fields: [
		{
			name: 'did',
			label: 'DID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'displayName',
			label: 'display name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'handle',
			label: 'handle',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$icon',
			label: 'icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$banner',
			label: 'banner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoActor_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'indexedAt',
			label: 'indexed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
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
			name: '$$posts',
			label: 'posts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
