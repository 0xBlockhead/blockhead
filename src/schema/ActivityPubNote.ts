import { type } from 'arktype'
import { mastodonVisibilities } from '$/constants/Social/MastodonVisibility.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export enum ActivityPubNoteSelector {
	InstanceOriginLocalStatusId = 'instanceOriginLocalStatusId',
}


const mastodonVisibilityPrimitive = type.or(
	...mastodonVisibilities.map((visibility) => type.unit(visibility.visibility)),
)

export default {
	entityType: EntityType.ActivityPubNote,

	label: 'ActivityPub note',
	labelPlural: 'ActivityPub notes',

	selectors: [
		{
			name: ActivityPubNoteSelector.InstanceOriginLocalStatusId,
			fields: [
				'instanceOrigin',
				'localStatusId',
			],
		},
	],

	fields: [
		{
			name: 'instanceOrigin',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localStatusId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'content',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'editedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activityStreamsUri',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'favouriteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reblogCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
		{
			name: 'visibility',
			type: EntityFieldType.Primitive,
			primitiveType: mastodonVisibilityPrimitive,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sensitive',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'language',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spoilerText',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$inReplyTo',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$reblogOf',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$media',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
		{
			name: '$$thread',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
