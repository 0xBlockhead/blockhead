// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LightningNodeSelector {
	NetworkPublicKey = 'NetworkPublicKey',
}
export const LightningNode = entity({
	entityType: EntityType.LightningNode,
	labels: {
		singular: 'Lightning node',
		plural: 'Lightning nodes',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	publicKey: {
		label: 'Public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LightningNode_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	},
	$$channels: {
		label: 'Channels',
		type: EntityFieldType.EntitiesReference,
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
