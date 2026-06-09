import { type } from 'arktype'

import { ZeroExHex, lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export type CastHash = `0x${string}`

export default {
	entityType: EntityType.FarcasterCast,

	label: 'Farcaster Cast',
	labelPlural: 'Farcaster Casts',

	id: type.or(
		type({
			fid: 'number',
			hash: ZeroExHex,
			'+': 'reject',
		}),
		type({
			hash: ZeroExHex,
			'+': 'reject',
		}),
		type({
			username: 'string',
			hashPrefix: ZeroExHex,
			'+': 'reject',
		}),
		type({
			clientUrl: UrlString,
			'+': 'reject',
		}),
	),

	lookups: [
		{
			name: 'usernameHashPrefix',
			fields: [
				'username',
				{
					name: 'hashPrefix',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
		{
			name: 'clientUrl',
			fields: [
				'clientUrl',
			],
		},
	],

	identities: [
		{
			name: 'hash',
			fields: [
				{
					name: 'hash',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
		{
			name: 'fidHash',
			fields: [
				{
					name: 'fid',
				},
				{
					name: 'hash',
					normalize: lowercaseHexIdentityValue,
				},
			],
		},
	],

	fields: [
		{
			name: 'fid',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'username',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hashPrefix',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'clientUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentCast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'mentions',
			type: EntityFieldType.Primitive,
			primitiveType: type('number[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$embeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCastEmbed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'recastCount',
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
			entityType: EntityType.FarcasterCast_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'threadHash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$postedViaApp',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mentionedProfileFids',
			type: EntityFieldType.Primitive,
			primitiveType: type('number[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mentionedChannelIds',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
