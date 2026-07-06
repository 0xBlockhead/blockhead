// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.MoneroNetwork,
	label: 'monero network',
	labelPlural: 'monero networks',
	description: 'Monero-specific view over a canonical Network row, with daemon RPC endpoints, node observations, and recent blocks.',
	selectors: [
		{
			name: MoneroNetworkSelector.Network,
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
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			label: 'Blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroBlock,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition
