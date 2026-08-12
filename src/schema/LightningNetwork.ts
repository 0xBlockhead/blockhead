// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LightningNetwork,
	labels: {
		singular: 'Lightning network',
		plural: 'Lightning networks',
	},
	description: 'The public Lightning graph with separate source-scoped network, node, and channel observations. Local LND invoices and payments remain distinct macaroon-authorized state.',
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
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	},
	$$nodes: {
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
	},
	$$channels: {
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.ZeroOrMany,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
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
