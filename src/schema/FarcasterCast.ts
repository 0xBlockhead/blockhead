import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
export enum FarcasterCastSelector {
	Hash = 'hash',
	FidHash = 'fidHash',
	UsernameHashPrefix = 'usernameHashPrefix',
	ClientUrl = 'clientUrl',
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
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'username',
			label: 'username',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hashPrefix',
			label: 'hash prefix',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientUrl',
			label: 'client URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'text',
			label: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentCast',
			label: 'parent cast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentUrl',
			label: 'parent URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestamp',
			label: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'mentions',
			label: 'mentions',
			type: EntityFieldType.Primitive,
			primitiveType: type("number[]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$embeds',
			label: 'embeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCastEmbed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'threadHash',
			label: 'thread hash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$channel',
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$postedViaApp',
			label: 'posted via app',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mentionedProfileFids',
			label: 'mentioned profile fids',
			type: EntityFieldType.Primitive,
			primitiveType: type("number[]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mentionedChannelIds',
			label: 'mentioned channel ids',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
