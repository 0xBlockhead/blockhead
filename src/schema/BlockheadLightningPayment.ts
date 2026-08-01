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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	paymentHash: {
		label: 'Payment hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	paymentRequest: {
		label: 'Payment request',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueMsat: {
		label: 'Value msat',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtMs: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentIndex: {
		label: 'Payment index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$localNodeState: {
		label: 'Local node state',
		entityType: EntityType.BlockheadLightningNodeState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$invoice: {
		label: 'Invoice',
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
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
