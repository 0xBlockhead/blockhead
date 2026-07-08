// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubInstancePeerSelector {
	InstanceOriginPeerDomainSource = 'InstanceOriginPeerDomainSource',
}
export const ActivityPubInstancePeer = entity({
	entityType: EntityType.ActivityPubInstancePeer,
	label: 'ActivityPub instance peer',
	labelPlural: 'ActivityPub instance peers',
	description: 'A domain that a declared ActivityPub instance reports as a known connected domain.',
})({
	instanceOrigin: {
		label: 'Instance origin',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	peerDomain: {
		label: 'Peer domain',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that observed this peer relation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		InstanceOriginPeerDomainSource: [
			'instanceOrigin',
			'peerDomain',
			'source',
		],
	},
})
