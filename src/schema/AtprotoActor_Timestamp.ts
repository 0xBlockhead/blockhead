// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AtprotoActor_TimestampSelector {
	AtprotoActorTimestampMs = 'AtprotoActorTimestampMs',
}
export default {
	entityType: EntityType.AtprotoActor_Timestamp,
	label: 'AT Protocol account observation',
	labelPlural: 'AT Protocol account observations',
	selectors: [
		{
			name: AtprotoActor_TimestampSelector.AtprotoActorTimestampMs,
			fields: [
				'$actor',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$actor',
			label: 'Account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followersCount',
			label: 'Followers',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followsCount',
			label: 'Following',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'postsCount',
			label: 'Posts',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
