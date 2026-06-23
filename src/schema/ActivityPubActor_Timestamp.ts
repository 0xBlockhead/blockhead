import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ActivityPubActor_TimestampSelector {
	ActivityPubActorTimestampMs = 'activityPubActorTimestampMs',
	ActorTimestampMs = '$actor+timestampMs',
}
export default {
	entityType: EntityType.ActivityPubActor_Timestamp,
	label: 'activity pub actor timestamp',
	labelPlural: 'activity pub actor observations',
	selectors: [
		{
			name: ActivityPubActor_TimestampSelector.ActivityPubActorTimestampMs,
			fields: [
				'$actor',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$actor',
			label: 'actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubActor,
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
			name: 'followersCount',
			label: 'followers count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			label: 'following count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusesCount',
			label: 'statuses count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
