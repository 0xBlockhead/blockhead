// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvailNetwork,
	labels: {
		singular: 'avail network',
		plural: 'avail networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AvailNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.AvailBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$appIds: {
		label: 'app ids',
		entityType: EntityType.AvailAppId,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dataSubmissions: {
		label: 'data submissions',
		entityType: EntityType.AvailDataSubmission,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
