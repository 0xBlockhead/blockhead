// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadSocialPostSessionStatus {
	Draft = 'Draft',
	Submitted = 'Submitted',
	Finalized = 'Finalized',
}
export enum SocialProtocol {
	Farcaster = 'Farcaster',
	Atproto = 'Atproto',
	ActivityPub = 'ActivityPub',
	Nostr = 'Nostr',
	X = 'X',
}
export enum BlockheadSocialPostSessionSelector {
	Id = 'Id',
}
export const BlockheadSocialPostSession = entity({
	entityType: EntityType.BlockheadSocialPostSession,
	labels: {
		singular: 'blockhead social post session',
		plural: 'blockhead social post sessions',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BlockheadSocialPostSessionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(SocialProtocol)),
		cardinality: EntityFieldCardinality.One,
	},
	authorKey: {
		label: 'author key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		label: 'wallet connection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$agentConversation: {
		label: 'agent conversation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		label: 'media',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	publishedEntityType: {
		label: 'published entity type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedSelector: {
		label: 'published selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedAt: {
		label: 'locked AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
