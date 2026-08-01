// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningNode,
	labels: {
		singular: 'Lightning node',
		plural: 'Lightning nodes',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		label: 'Public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.LightningNode_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	},
	$$channels: {
		label: 'Channels',
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPublicKey: [
			'$network',
			'publicKey',
		],
	},
})
