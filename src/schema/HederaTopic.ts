// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTopicSelector {
	NetworkTopicId = 'NetworkTopicId',
}
export const HederaTopic = entity({
	entityType: EntityType.HederaTopic,
	labels: {
		singular: 'hedera topic',
		plural: 'hedera topics',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	topicId: {
		label: 'topic ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$messages: {
		label: 'messages',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaTopicMessage,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
