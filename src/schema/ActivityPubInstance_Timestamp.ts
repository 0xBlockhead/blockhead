// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubInstance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		label: 'Peers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubInstancePeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$moderatedDomains: {
		label: 'Moderated domains',
		type: EntityFieldType.EntitiesReference,
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
