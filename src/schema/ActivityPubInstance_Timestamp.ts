// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ActivityPubInstance_Timestamp,
	labels: {
		singular: 'ActivityPub instance observation',
		plural: 'ActivityPub instance observations',
	},
})({
	$instance: {
		entityType: EntityType.ActivityPubInstance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		entityType: EntityType.ActivityPubInstancePeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$moderatedDomains: {
		entityType: EntityType.ActivityPubInstanceModeratedDomain,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		InstanceTimestampMsSource: [
			'$instance',
			'timestampMs',
			'source',
		],
	},
})
