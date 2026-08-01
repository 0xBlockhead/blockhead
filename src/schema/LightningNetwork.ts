// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningNetwork,
	labels: {
		singular: 'Lightning network',
		plural: 'Lightning networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$settlementNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.LightningNetwork_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$nodes: {
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$channels: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.ZeroOrMany,
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
		Network: [
			'$network',
		],
	},
})
