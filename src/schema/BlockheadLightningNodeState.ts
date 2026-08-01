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
		label: 'connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		entityType: EntityType.LightningNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	lndPubkey: {
		label: 'lnd public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	alias: {
		label: 'alias',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	macaroonPermissions: {
		label: 'macaroon permissions',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$node: {
		label: 'node',
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadLightningNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channelStates: {
		label: 'channel states',
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channels: {
		label: 'channels',
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$invoices: {
		label: 'invoices',
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payments: {
		label: 'payments',
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
