// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum FarcasterCastSelector {
	Hash = 'Hash',
	FidHash = 'FidHash',
	UsernameHashPrefix = 'UsernameHashPrefix',
	ClientUrl = 'ClientUrl',
}
export default {
	entityType: EntityType.FarcasterCast,
	label: 'Farcaster cast',
	labelPlural: 'Farcaster casts',
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
				label: 'FID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'hash',
				label: 'Hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'username',
				label: 'Username',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'hashPrefix',
				label: 'Hash prefix',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'clientUrl',
				label: 'Client URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$author',
				label: 'Author',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FarcasterUser,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'text',
				label: 'Text',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$parentCast',
				label: 'Parent cast',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FarcasterCast,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'parentUrl',
				label: 'Parent URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestamp',
				label: 'Timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mentions',
				label: 'Mentions',
				type: EntityFieldType.Primitive,
				primitiveType: type('number').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$embeds',
				label: 'Embeds',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FarcasterCastEmbed,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FarcasterCast_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'threadHash',
				label: 'Thread hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$channel',
				label: 'Channel',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FarcasterChannel,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$postedViaApp',
				label: 'Posted via app',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FarcasterUser,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mentionedProfileFids',
				label: 'Mentioned profile FIDs',
				type: EntityFieldType.Primitive,
				primitiveType: type('number').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'mentionedChannelIds',
				label: 'Mentioned channel IDs',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
