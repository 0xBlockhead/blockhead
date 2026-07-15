// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmActorCoinAllowance_BlockSelector {
	AllowanceBlockNumberSource = 'AllowanceBlockNumberSource',
}
export const EvmActorCoinAllowance_Block = entity({
	entityType: EntityType.EvmActorCoinAllowance_Block,
	labels: {
		singular: 'EVM actor coin allowance block',
		plural: 'EVM actor coin allowance blocks',
	},
})({
	$allowance: {
		label: 'Allowance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmActorCoinAllowance,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allowance: {
		label: 'Allowance',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	blockTag: {
		label: 'Block tag',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	checkedAt: {
		label: 'Checked at',
		type: EntityFieldType.Primitive,
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
