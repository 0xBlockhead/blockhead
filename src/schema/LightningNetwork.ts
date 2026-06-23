import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LightningNetworkSelector {
	Network = 'network',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$settlementNetwork',
			label: 'settlement network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$nodes',
			label: 'nodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$channels',
			label: 'channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$invoices',
			label: 'invoices',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningInvoice,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$payments',
			label: 'payments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningPayment,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$localNodeStates',
			label: 'local node states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningNodeState,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
