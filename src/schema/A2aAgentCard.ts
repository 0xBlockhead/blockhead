// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.A2aAgentCard,
	labels: {
		singular: 'a2a agent card',
		plural: 'a2a agent cards',
	},
})({
	agentCardUrl: {
		label: 'agent card URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$snapshots: {
		label: 'snapshots',
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		label: 'documents',
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
