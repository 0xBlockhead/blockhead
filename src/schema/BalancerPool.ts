// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BalancerPool,
	labels: {
		singular: 'Balancer pool',
		plural: 'Balancer pools',
	},
	description: 'A Balancer v2/v3 pool identified by EIP-155 network + native pool id (v2 bytes32 poolId, v3 pool address), with Vault accounting per docs.balancer.fi.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	poolId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	poolType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	version: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	protocolVersion: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	vaultAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	swapFee: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	totalLiquidity: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	totalShares: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
	$$tokens: {
		entityType: EntityType.BalancerPoolToken,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
	$$aprItems: {
		entityType: EntityType.BalancerPoolAprItem,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Balancer_Rest,
		],
	},
})({
	selectors: {
		NetworkPoolId: [
			'$network',
			'poolId',
		],
	},
})
