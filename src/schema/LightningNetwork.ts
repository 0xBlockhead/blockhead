// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LightningNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.LightningNetwork,
	label: 'Lightning network',
	labelPlural: 'Lightning networks',
	selectors: [
		{
			name: LightningNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$settlementNetwork',
				label: 'Settlement network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningNetwork_Timestamp,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
				name: '$$nodes',
				label: 'Nodes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningNode,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
				name: '$$channels',
				label: 'Channels',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LightningChannel,
				cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
				name: '$$invoices',
				label: 'Invoices',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLightningInvoice,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$payments',
				label: 'Payments',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadLightningPayment,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
