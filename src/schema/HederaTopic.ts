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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	topicId: {
		label: 'topic ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$messages: {
		label: 'messages',
		entityType: EntityType.HederaTopicMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
