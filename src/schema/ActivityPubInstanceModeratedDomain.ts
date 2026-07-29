// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubInstance_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	domain: {
		label: 'Domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	severity: {
		label: 'Severity',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	comment: {
		label: 'Comment',
		type: EntityFieldType.Primitive,
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
