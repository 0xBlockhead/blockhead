// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum A2aAgentCardSelector {
	AgentCardUrl = 'AgentCardUrl',
}
export const A2aAgentCard = entity({
	entityType: EntityType.A2aAgentCard,
	labels: {
		singular: 'a2a agent card',
		plural: 'a2a agent cards',
	},
})({
	agentCardUrl: {
		label: 'agent card URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	$$snapshots: {
		label: 'snapshots',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		label: 'documents',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AgentCardUrl: [
			'agentCardUrl',
		],
	},
})
