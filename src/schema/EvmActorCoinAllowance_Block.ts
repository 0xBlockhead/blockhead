// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmActorCoinAllowance_BlockSelector {
	AllowanceBlockNumberSource = 'AllowanceBlockNumberSource',
}
export default {
	entityType: EntityType.EvmActorCoinAllowance_Block,
	label: 'EVM actor coin allowance block',
	labelPlural: 'EVM actor coin allowance blocks',
	selectors: [
		{
			name: EvmActorCoinAllowance_BlockSelector.AllowanceBlockNumberSource,
			fields: [
				'$allowance',
				'blockNumber',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$allowance',
			label: 'Allowance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmActorCoinAllowance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allowance',
			label: 'Allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockTag',
			label: 'Block tag',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'checkedAt',
			label: 'Checked at',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
