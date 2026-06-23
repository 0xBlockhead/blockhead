import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadKaspaNodeStateSelector {
	ConnectionIdNetwork = 'connectionId+network',
}
export default {
	entityType: EntityType.BlockheadKaspaNodeState,
	label: 'blockhead kaspa node state',
	labelPlural: 'blockhead kaspa node states',
	selectors: [
		{
			name: BlockheadKaspaNodeStateSelector.ConnectionIdNetwork,
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
			entityType: EntityType.KaspaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rpcUrl',
			label: 'RPC URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'encoding',
			label: 'encoding',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'networkId',
			label: 'network ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadKaspaNodeState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
