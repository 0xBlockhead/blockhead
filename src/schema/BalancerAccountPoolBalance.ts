// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BalancerAccountPoolBalance,
	labels: {
		singular: 'Balancer account pool balance',
		plural: 'Balancer account pool balances',
	},
	description: 'An EVM account\'s BPT wallet and total balance in one Balancer pool from poolGetPools(where.userAddress).',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		entityType: EntityType.BalancerPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	totalBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	totalBalanceUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	walletBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	walletBalanceUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	$gauge: {
		entityType: EntityType.BalancerGauge,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	stakingType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
})({
	selectors: {
		AccountPool: [
			'$account',
			'$pool',
		],
	},
})
