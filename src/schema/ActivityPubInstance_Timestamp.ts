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
		label: 'Instance',
		entityType: EntityType.ActivityPubInstance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		label: 'Peers',
		entityType: EntityType.ActivityPubInstancePeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$moderatedDomains: {
		label: 'Moderated domains',
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
