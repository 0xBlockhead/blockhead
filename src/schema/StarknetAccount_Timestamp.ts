// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetAccount_TimestampSelector {
	ContractBlockNumberSource = 'ContractBlockNumberSource',
}
export default {
	entityType: EntityType.StarknetAccount_Timestamp,
	label: 'starknet account timestamp',
	labelPlural: 'starknet account observations',
	selectors: [
		{
			name: StarknetAccount_TimestampSelector.ContractBlockNumberSource,
			fields: [
				'$contract',
				'blockNumber',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$contract',
				label: 'contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StarknetContract,
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
				name: 'nonce',
				label: 'nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'classHash',
				label: 'class hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'found',
				label: 'found',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
