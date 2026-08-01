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
		label: 'FID',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		label: 'Username',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hashPrefix: {
		label: 'Hash prefix',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	clientUrl: {
		label: 'Client URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentCast: {
		label: 'Parent cast',
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentUrl: {
		label: 'Parent URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rootParentUrl: {
		label: 'Root parent URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentions: {
		label: 'Mentions',
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$directReplies: {
		label: 'Direct replies',
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Farcaster_Rest,
		],
	},
	$$embeds: {
		label: 'Embeds',
		entityType: EntityType.FarcasterCastEmbed,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.FarcasterCast_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	threadHash: {
		label: 'Thread hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		label: 'Channel',
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$postedViaApp: {
		label: 'Posted via app',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentionedProfileFids: {
		label: 'Mentioned profile FIDs',
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mentionedChannelIds: {
		label: 'Mentioned channel IDs',
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
