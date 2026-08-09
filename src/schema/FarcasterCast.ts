// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterCast,
	labels: {
		singular: 'Farcaster cast',
		plural: 'Farcaster casts',
	},
})({
	fid: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	hashPrefix: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	clientUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentCast: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rootParentUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentions: {
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$directReplies: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Farcaster_Rest,
		],
	},
	$$embeds: {
		entityType: EntityType.FarcasterCastEmbed,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.FarcasterCast_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	threadHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$postedViaApp: {
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentionedProfileFids: {
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentionedChannelIds: {
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
