// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BlockheadSocialPostSessionStatus } from '$/schema/BlockheadSocialPostSessionStatus.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { SocialProtocol } from '$/schema/SocialProtocol.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSocialPostSession,
	labels: {
		singular: 'blockhead social post session',
		plural: 'blockhead social post sessions',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type.enumerated(...Object.values(BlockheadSocialPostSessionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'protocol',
		primitiveType: type.enumerated(...Object.values(SocialProtocol)),
		cardinality: EntityFieldCardinality.One,
	},
	authorKey: {
		label: 'author key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		label: 'wallet connection',
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$agentConversation: {
		label: 'agent conversation',
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		label: 'media',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	publishedEntityType: {
		label: 'published entity type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedSelector: {
		label: 'published selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedAt: {
		label: 'locked AT',
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
