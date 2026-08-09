// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandAssetHolding_Round,
	labels: {
		singular: 'algorand asset holding round',
		plural: 'algorand asset holding rounds',
	},
})({
	$account: {
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		entityType: EntityType.AlgorandAsset,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	frozen: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	optedInAtRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountAssetRoundSource: [
			'$account',
			'$asset',
			'round',
			'source',
		],
	},
})
