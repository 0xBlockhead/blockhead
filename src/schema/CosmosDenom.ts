// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosDenom,
	labels: {
		singular: 'Cosmos denom',
		plural: 'Cosmos denoms',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	denom: {
		label: 'Denom',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	display: {
		label: 'Display',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	base: {
		label: 'Base',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkDenom: [
			'$network',
			'denom',
		],
	},
})
