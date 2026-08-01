// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export default entity({
	entityType: EntityType.A2aAgentCard,
	labels: {
		singular: 'a2a agent card',
		plural: 'a2a agent cards',
	},
})({
	agentCardUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$snapshots: {
		entityType: EntityType.A2aAgentCard_Snapshot,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
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
