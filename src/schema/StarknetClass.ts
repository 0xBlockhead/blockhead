// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum StarknetClassSelector {
	NetworkClassHash = 'NetworkClassHash',
}
export default {
	entityType: EntityType.StarknetClass,
	label: 'starknet class',
	labelPlural: 'starknet classes',
	selectors: [
		{
			name: StarknetClassSelector.NetworkClassHash,
			fields: [
				'$network',
				'classHash',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StarknetNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'classHash',
				label: 'class hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sierraProgramHash',
				label: 'sierra program hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'casmClassHash',
				label: 'casm class hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'abiHash',
				label: 'ABI hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractClassVersion',
				label: 'contract class version',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'declaredAtBlockNumber',
				label: 'declared at block number',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'declaredByTransactionHash',
				label: 'declared by transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$contracts',
				label: 'contracts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StarknetContract,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
