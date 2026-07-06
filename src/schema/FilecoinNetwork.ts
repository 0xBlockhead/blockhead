// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FilecoinNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.FilecoinNetwork,
	label: 'filecoin network',
	labelPlural: 'filecoin networks',
	description: 'Filecoin-specific view over a canonical Network row, including Lotus endpoints, chain head observations, and tipsets.',
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
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'rpcEndpoints',
			label: 'RPC endpoints',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
		{
			name: '$$tipsets',
			label: 'Tipsets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FilecoinTipset,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Lotus_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
