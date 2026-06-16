import { type } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export enum FarcasterCastSelector {
	Hash = 'hash',
	FidHash = 'fidHash',
	UsernameHashPrefix = 'usernameHashPrefix',
	ClientUrl = 'clientUrl',
}


export type CastHash = `0x${string}`

export default {
	entityType: EntityType.FarcasterCast,

	label: 'Farcaster Cast',
	labelPlural: 'Farcaster Casts',

	selectors: [
		{
			name: FarcasterCastSelector.Hash,
			fields: [
				'hash',
			],
		},
		{
			name: FarcasterCastSelector.FidHash,
			fields: [
				'fid',
				'hash',
			],
		},
		{
			name: FarcasterCastSelector.UsernameHashPrefix,
			fields: [
				'username',
				'hashPrefix',
			],
		},
		{
			name: FarcasterCastSelector.ClientUrl,
			fields: [
				'clientUrl',
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
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hashPrefix',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
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
