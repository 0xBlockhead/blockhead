// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XUser_TimestampSelector {
	XUserTimestampMs = 'XUserTimestampMs',
}
export default {
	entityType: EntityType.XUser_Timestamp,
	label: 'X user observation',
	labelPlural: 'X user observations',
	selectors: [
		{
			name: XUser_TimestampSelector.XUserTimestampMs,
			fields: [
				'$user',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$user',
			label: 'User',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XUser,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followerCount',
			label: 'Followers',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			label: 'Following',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tweetCount',
			label: 'Tweets',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listedCount',
			label: 'Listed',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
