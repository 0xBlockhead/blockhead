// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningPayment,
	labels: {
		singular: 'Lightning payment',
		plural: 'Lightning payments',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	paymentHash: {
		label: 'Payment hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	paymentRequest: {
		label: 'Payment request',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueMsat: {
		label: 'Value msat',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtMs: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentIndex: {
		label: 'Payment index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$localNodeState: {
		label: 'Local node state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$invoice: {
		label: 'Invoice',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningPayment_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPaymentHash: [
			'$network',
			'paymentHash',
		],
	},
})
