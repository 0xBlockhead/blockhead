// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningNodeState,
	labels: {
		singular: 'blockhead Lightning node state',
		plural: 'blockhead Lightning node states',
	},
})({
	connectionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.LightningNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	lndPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	alias: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	macaroonPermissions: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$node: {
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadLightningNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channelStates: {
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channels: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$invoices: {
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payments: {
		entityType: EntityType.BlockheadLightningPayment,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdNetwork: [
			'connectionId',
			'$network',
		],
	},
})
