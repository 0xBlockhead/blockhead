// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerStrategy,
	labels: {
		singular: 'eigen layer strategy',
		plural: 'eigen layer strategies',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	strategyAddress: {
		label: 'strategy address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$strategyContract: {
		label: 'strategy contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	underlyingToken: {
		label: 'underlying token',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$underlyingCoin: {
		label: 'underlying coin',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	strategyKind: {
		label: 'strategy kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerStrategy_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$delegations: {
		label: 'delegations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerDelegation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$allocations: {
		label: 'allocations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerAllocation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkStrategyAddress: [
			'$network',
			'strategyAddress',
		],
	},
})
