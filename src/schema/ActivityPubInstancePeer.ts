// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubInstancePeerSelector {
	ObservationPeerDomain = 'ObservationPeerDomain',
}
export const ActivityPubInstancePeer = entity({
	entityType: EntityType.ActivityPubInstancePeer,
	labels: {
		singular: 'ActivityPub instance peer',
		plural: 'ActivityPub instance peers',
	},
	description: 'A domain that a declared ActivityPub instance reports as a known connected domain.',
})({
	$observation: {
		label: 'Observation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubInstance_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	peerDomain: {
		label: 'Peer domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		ObservationPeerDomain: [
			'$observation',
			'peerDomain',
		],
	},
})
