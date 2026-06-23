import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmActorCoinAllowance_BlockSelector {
	AllowanceBlockNumberSource = '$allowance+blockNumber+source',
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
			label: 'allowance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmActorCoinAllowance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'allowance',
			label: 'allowance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockTag',
			label: 'block tag',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'checkedAt',
			label: 'checked AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
