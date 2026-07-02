// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.PolkadotNetwork,
	label: 'Polkadot network',
	labelPlural: 'Polkadot networks',
	selectors: [
		{
			name: PolkadotNetworkSelector.Network,
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
		},
		{
				name: '$$timestamps',
				label: 'Runtime snapshots',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotBlock,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$validators',
				label: 'Validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotValidator,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
