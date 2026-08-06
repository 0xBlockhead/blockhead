// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BalancerVeBalBalance,
	labels: {
		singular: 'Balancer veBAL balance',
		plural: 'Balancer veBAL balances',
	},
	description: 'An EVM account\'s veBAL voting-power lock snapshot from veBalGetUser / veBalGetUserBalance.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	balance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	locked: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	lockedUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	rank: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
})({
	selectors: {
		Account: [
			'$account',
		],
	},
})
