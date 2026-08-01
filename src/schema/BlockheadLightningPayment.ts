// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	paymentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	paymentRequest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueMsat: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$localNodeState: {
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$invoice: {
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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
