// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CompoundPosition,
	labels: {
		singular: 'Compound position',
		plural: 'Compound positions',
	},
	description: 'An account base supply/borrow balance and collateral set against one Compound III Comet market.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$comet: {
		entityType: EntityType.CompoundComet,
		cardinality: EntityFieldCardinality.One,
	},
	baseTokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	baseTokenAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	suppliedBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	borrowedBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
	$$collaterals: {
		entityType: EntityType.CompoundPositionCollateral,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Compound_Rest,
		],
	},
})({
	selectors: {
		AccountComet: [
			'$account',
			'$comet',
		],
	},
})
