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
		label: 'Allowance',
		entityType: EntityType.EvmActorCoinAllowance,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allowance: {
		label: 'Allowance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockTag: {
		label: 'Block tag',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	checkedAt: {
		label: 'Checked at',
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
