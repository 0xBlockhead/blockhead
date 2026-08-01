// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaTopic,
	labels: {
		singular: 'hedera topic',
		plural: 'hedera topics',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	topicId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$messages: {
		entityType: EntityType.HederaTopicMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.HederaTopic_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTopicId: [
			'$network',
			'topicId',
		],
	},
})
