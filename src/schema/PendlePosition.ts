// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.PendlePosition,
	labels: {
		singular: 'Pendle position',
		plural: 'Pendle positions',
	},
	description: 'An account PT/YT/SY/LP balance set against one Pendle V2 market.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		entityType: EntityType.PendleMarket,
		cardinality: EntityFieldCardinality.One,
	},
	ptBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	ytBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	syBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
	lpBalance: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Pendle_Rest,
		],
	},
})({
	selectors: {
		AccountMarket: [
			'$account',
			'$market',
		],
	},
})
