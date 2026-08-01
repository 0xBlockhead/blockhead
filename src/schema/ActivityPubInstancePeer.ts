// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ActivityPubInstancePeer,
	labels: {
		singular: 'ActivityPub instance peer',
		plural: 'ActivityPub instance peers',
	},
	description: 'A domain that a declared ActivityPub instance reports as a known connected domain.',
})({
	$observation: {
		entityType: EntityType.ActivityPubInstance_Timestamp,
		cardinality: EntityFieldCardinality.One,
	},
	peerDomain: {
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
