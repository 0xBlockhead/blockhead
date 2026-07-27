// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	lndPubkey: {
		label: 'lnd public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	alias: {
		label: 'alias',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	macaroonPermissions: {
		label: 'macaroon permissions',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$node: {
		label: 'node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channelStates: {
		label: 'channel states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningChannelState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$channels: {
		label: 'channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$invoices: {
		label: 'invoices',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payments: {
		label: 'payments',
		type: EntityFieldType.EntitiesReference,
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
