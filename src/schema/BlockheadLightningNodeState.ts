import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadLightningNodeStateSelector {
	ConnectionIdNetwork = 'connectionId+network',
}
export default {
	entityType: EntityType.BlockheadLightningNodeState,
	label: 'blockhead Lightning node state',
	labelPlural: 'blockhead Lightning node states',
	selectors: [
		{
			name: BlockheadLightningNodeStateSelector.ConnectionIdNetwork,
			fields: [
				'connectionId',
				'network',
			],
		},
	],
	fields: [
		{
			name: 'connectionId',
			label: 'connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lndPubkey',
			label: 'lnd public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'alias',
			label: 'alias',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'macaroonPermissions',
			label: 'macaroon permissions',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$node',
			label: 'node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningNodeState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$channelStates',
			label: 'channel states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadLightningChannelState,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$channels',
			label: 'channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.Many,
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
	],
} as const satisfies EntityDefinition
