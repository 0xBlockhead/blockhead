// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PendleMarket,
	labels: {
		singular: 'Pendle market',
		plural: 'Pendle markets',
	},
	description: 'A Pendle V2 yield-trading market on an EIP-155 network, identified by its market contract address (PT/YT/SY split around a standardized yield token).',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	marketAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	protocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	icon: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	expiryTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	ptAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	ytAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	syAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	underlyingAssetAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	impliedApy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	underlyingApy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	totalTvlUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	liquidityUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	tradingVolumeUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	feeRate: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	totalPt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	totalSy: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	totalSupply: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	isPrime: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	isNew: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	observedAtTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
})({
	selectors: {
		NetworkMarketAddress: [
			'$network',
			'marketAddress',
		],
	},
})
