// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum A2aAgentCardSelector {
	AgentCardUrl = 'AgentCardUrl',
}
export default {
	entityType: EntityType.A2aAgentCard,
	label: 'a2a agent card',
	labelPlural: 'a2a agent cards',
	selectors: [
		{
			name: A2aAgentCardSelector.AgentCardUrl,
			fields: [
				'agentCardUrl',
			],
		},
	],
	fields: [
		{
				name: 'agentCardUrl',
				label: 'agent card URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$snapshots',
				label: 'snapshots',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.A2aAgentCard_Snapshot,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$documents',
				label: 'documents',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiDocument,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
