// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmActorCoinAllowance_Block,
	labels: {
		singular: 'EVM actor coin allowance block',
		plural: 'EVM actor coin allowance blocks',
	},
})({
	$allowance: {
		entityType: EntityType.EvmActorCoinAllowance,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allowance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockTag: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	checkedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AllowanceBlockNumberSource: [
			'$allowance',
			'blockNumber',
			'source',
		],
	},
})
