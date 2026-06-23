import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LightningNodeSelector {
	NetworkPublicKey = 'networkPublicKey',
}
export default {
	entityType: EntityType.LightningNode,
	label: 'Lightning node',
	labelPlural: 'Lightning nodes',
	selectors: [
		{
			name: LightningNodeSelector.NetworkPublicKey,
			fields: [
				'$network',
				'publicKey',
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
			name: 'publicKey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNode_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$channels',
			label: 'channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.ZeroOrMany,
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
