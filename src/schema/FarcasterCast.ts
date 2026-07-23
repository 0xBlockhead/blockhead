// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterCastSelector {
	Hash = 'Hash',
	FidHash = 'FidHash',
	UsernameHashPrefix = 'UsernameHashPrefix',
	ClientUrl = 'ClientUrl',
}
export const FarcasterCast = entity({
	entityType: EntityType.FarcasterCast,
	labels: {
		singular: 'Farcaster cast',
		plural: 'Farcaster casts',
	},
})({
	fid: {
		label: 'FID',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		label: 'Username',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hashPrefix: {
		label: 'Hash prefix',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientUrl: {
		label: 'Client URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentCast: {
		label: 'Parent cast',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentUrl: {
		label: 'Parent URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rootParentUrl: {
		label: 'Root parent URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentions: {
		label: 'Mentions',
		type: EntityFieldType.Primitive,
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$directReplies: {
		label: 'Direct replies',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Farcaster_Rest,
		],
	},
	$$embeds: {
		label: 'Embeds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterCastEmbed,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterCast_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	threadHash: {
		label: 'Thread hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		label: 'Channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$postedViaApp: {
		label: 'Posted via app',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentionedProfileFids: {
		label: 'Mentioned profile FIDs',
		type: EntityFieldType.Primitive,
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentionedChannelIds: {
		label: 'Mentioned channel IDs',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Hash: [
			'hash',
		],
		FidHash: [
			'fid',
			'hash',
		],
		UsernameHashPrefix: [
			'username',
			'hashPrefix',
		],
		ClientUrl: [
			'clientUrl',
		],
	},
})
