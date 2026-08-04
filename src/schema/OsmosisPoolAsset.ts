import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.OsmosisPoolAsset,
	labels: {
		singular: 'Osmosis pool asset',
		plural: 'Osmosis pool assets',
	},
	description: 'A denom balance (and optional balancer weight) inside an Osmosis poolmanager pool.',
})({
	$pool: {
		entityType: EntityType.OsmosisPool,
		cardinality: EntityFieldCardinality.One,
	},
	denom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.One,
	},
	weight: {
		primitiveType: NonNegativeDecimalString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$cosmosDenom: {
		entityType: EntityType.CosmosDenom,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		PoolDenom: [
			'$pool',
			'denom',
		],
	},
})
