// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvailAppId,
	labels: {
		singular: 'avail app ID',
		plural: 'avail app IDs',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.AvailNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	appId: {
		label: 'app ID',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerSelector: {
		label: 'owner selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$dataSubmissions: {
		label: 'data submissions',
		entityType: EntityType.AvailDataSubmission,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AvailAppId_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAppId: [
			'$network',
			'appId',
		],
	},
})
