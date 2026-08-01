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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type.enumerated(...Object.values(BlockheadSocialPostSessionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		primitiveType: type.enumerated(...Object.values(SocialProtocol)),
		cardinality: EntityFieldCardinality.One,
	},
	authorKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletConnection: {
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$agentConversation: {
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	publishedEntityType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lockedAt: {
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
