// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EigenLayerStrategySelector {
	NetworkStrategyAddress = 'NetworkStrategyAddress',
}
export default {
	entityType: EntityType.EigenLayerStrategy,
	label: 'eigen layer strategy',
	labelPlural: 'eigen layer strategies',
	selectors: [
		{
			name: EigenLayerStrategySelector.NetworkStrategyAddress,
			fields: [
				'$network',
				'strategyAddress',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'strategyAddress',
			label: 'strategy address',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$strategyContract',
			label: 'strategy contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'underlyingToken',
			label: 'underlying token',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$underlyingCoin',
			label: 'underlying coin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'strategyKind',
			label: 'strategy kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerStrategy_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$delegations',
			label: 'delegations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerDelegation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$allocations',
			label: 'allocations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EigenLayerAllocation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
