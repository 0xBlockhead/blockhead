import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FilecoinNetworkSelector {
	Network = 'network',
}
export default {
	entityType: EntityType.FilecoinNetwork,
	label: 'filecoin network',
	labelPlural: 'filecoin networks',
	selectors: [
		{
			name: FilecoinNetworkSelector.Network,
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
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({"url": "string", "transportType": "string", "providerName": "string"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tipsets',
			label: 'tipsets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
