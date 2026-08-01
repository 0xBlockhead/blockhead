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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$settlementNetwork: {
		label: 'Settlement network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.LightningNetwork_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$nodes: {
		label: 'Nodes',
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$channels: {
		label: 'Channels',
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$invoices: {
		label: 'Invoices',
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payments: {
		label: 'Payments',
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
