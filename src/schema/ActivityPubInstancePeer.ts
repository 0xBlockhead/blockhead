// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubInstancePeerSelector {
	InstanceOriginPeerDomainSource = 'InstanceOriginPeerDomainSource',
}
export default {
	entityType: EntityType.ActivityPubInstancePeer,
	label: 'ActivityPub instance peer',
	labelPlural: 'ActivityPub instance peers',
	description: 'A domain that a declared ActivityPub instance reports as a known connected domain.',
	selectors: [
		{
			name: ActivityPubInstancePeerSelector.InstanceOriginPeerDomainSource,
			fields: [
				'instanceOrigin',
				'peerDomain',
				'source',
			],
		},
	],
	fields: [
		{
			name: 'instanceOrigin',
			label: 'Instance origin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'peerDomain',
			label: 'Peer domain',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that observed this peer relation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
