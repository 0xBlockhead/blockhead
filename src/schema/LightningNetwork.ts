// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$settlementNetwork: {
		label: 'Settlement network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LightningNetwork_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$nodes: {
		label: 'Nodes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LightningNode,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$channels: {
		label: 'Channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LightningChannel,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
	$$invoices: {
		label: 'Invoices',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLightningInvoice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$payments: {
		label: 'Payments',
		type: EntityFieldType.EntitiesReference,
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
