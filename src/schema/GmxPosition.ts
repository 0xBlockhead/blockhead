// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { DecimalString } from '$/schema/DecimalString.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress, Hash32, lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GmxPosition,
	labels: {
		singular: 'GMX position',
		plural: 'GMX positions',
	},
	description: 'A GMX V2 perpetual position for an EVM account, identified by bytes32 contract key.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	contractKey: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		entityType: EntityType.GmxMarket,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	collateralTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	isLong: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	sizeInUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	sizeInTokens: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	collateralAmount: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	collateralUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	positionValueInUsd: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	pnl: {
		primitiveType: DecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	leverage: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	entryPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	markPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	liquidationPrice: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	indexName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
	poolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Gmx_Rest,
		],
	},
})({
	selectors: {
		AccountContractKey: [
			'$account',
			'contractKey',
		],
	},
})
