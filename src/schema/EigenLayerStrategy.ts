// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	strategyAddress: {
		label: 'strategy address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$strategyContract: {
		label: 'strategy contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	underlyingToken: {
		label: 'underlying token',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$underlyingCoin: {
		label: 'underlying coin',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	strategyKind: {
		label: 'strategy kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.EigenLayerStrategy_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$delegations: {
		label: 'delegations',
		entityType: EntityType.EigenLayerDelegation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$allocations: {
		label: 'allocations',
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
