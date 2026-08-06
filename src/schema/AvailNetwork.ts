// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.AvailNetwork,
	labels: {
		singular: 'avail network',
		plural: 'avail networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.AvailNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Avail,
		],
	},
	$$blocks: {
		entityType: EntityType.AvailBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Avail,
		],
	},
	$$appIds: {
		entityType: EntityType.AvailAppId,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dataSubmissions: {
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
