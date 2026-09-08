// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.AaveAccountMarket,
	labels: {
		singular: 'Aave account market',
		plural: 'Aave account markets',
	},
	description: 'One EVM account\'s provider-observed state within an Aave V3 market.',
})({
	$account: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$market: {
		entityType: EntityType.AaveMarket,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.AaveAccountMarket_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Aave_Rest,
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
