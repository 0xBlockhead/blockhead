// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTopicSelector {
	NetworkTopicId = 'NetworkTopicId',
}
export default {
	entityType: EntityType.HederaTopic,
	label: 'hedera topic',
	labelPlural: 'hedera topics',
	selectors: [
		{
			name: HederaTopicSelector.NetworkTopicId,
			fields: [
				'$network',
				'topicId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'topicId',
			label: 'topic ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTopicMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTopic_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
