// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ActivityPubInstanceModeratedDomain,
	labels: {
		singular: 'ActivityPub instance moderated domain',
		plural: 'ActivityPub instance moderated domains',
	},
	description: 'A domain that a declared ActivityPub instance reports in its public moderation-domain list.',
})({
	$observation: {
		label: 'Observation',
		entityType: EntityType.ActivityPubInstance_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	domain: {
		label: 'Domain',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	severity: {
		label: 'Severity',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	comment: {
		label: 'Comment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ObservationDomain: [
			'$observation',
			'domain',
		],
	},
})
