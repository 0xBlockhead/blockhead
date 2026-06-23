import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ActivityPubActorSelector {
	ActivityStreamsUri = 'activityStreamsUri',
	LocalAccountId = 'localAccountId',
	InstanceOriginLocalAccountId = 'instanceOrigin+localAccountId',
	Acct = 'acct',
	InstanceOriginAcct = 'instanceOrigin+acct',
}
export default {
	entityType: EntityType.ActivityPubActor,
	label: 'activity pub actor',
	labelPlural: 'activity pub actors',
	selectors: [
		{
			name: ActivityPubActorSelector.ActivityStreamsUri,
			fields: [
				'activityStreamsUri',
			],
		},
		{
			name: ActivityPubActorSelector.LocalAccountId,
			fields: [
				'instanceOrigin',
				'localAccountId',
			],
		},
		{
			name: ActivityPubActorSelector.Acct,
			fields: [
				'instanceOrigin',
				'acct',
			],
		},
	],
	fields: [
		{
			name: 'instanceOrigin',
			label: 'instance origin',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localAccountId',
			label: 'local account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'username',
			label: 'username',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'acct',
			label: 'acct',
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
			name: 'note',
			label: 'note',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$headerImage',
			label: 'header image',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'profileUrl',
			label: 'profile URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activityStreamsUri',
			label: 'activity streams URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'website',
			label: 'website',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubActor_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'bot',
			label: 'bot',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'locked',
			label: 'locked',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$notes',
			label: 'notes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
