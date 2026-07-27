// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvailNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvailBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$appIds: {
		label: 'app ids',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AvailAppId,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dataSubmissions: {
		label: 'data submissions',
		type: EntityFieldType.EntitiesReference,
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
