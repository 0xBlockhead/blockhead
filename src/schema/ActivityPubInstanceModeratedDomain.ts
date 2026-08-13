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
		entityType: EntityType.ActivityPubInstance_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	digest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	domain: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	severity: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	comment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ObservationDigest: [
			'$observation',
			'digest',
		],
	},
})
