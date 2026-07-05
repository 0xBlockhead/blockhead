// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum HederaContractLogSelector {
	ResultLogIndex = 'ResultLogIndex',
	ContractConsensusTimestampLogIndex = 'ContractConsensusTimestampLogIndex',
}
export default {
	entityType: EntityType.HederaContractLog,
	label: 'hedera contract log',
	labelPlural: 'hedera contract logs',
	selectors: [
		{
			name: HederaContractLogSelector.ResultLogIndex,
			fields: [
				'$result',
				'logIndex',
			],
		},
		{
			name: HederaContractLogSelector.ContractConsensusTimestampLogIndex,
			fields: [
				'$contract',
				'consensusTimestamp',
				'logIndex',
			],
		},
	],
	fields: [
		{
				name: '$result',
				label: 'result',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaContractResult,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$contract',
				label: 'contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'consensusTimestamp',
				label: 'consensus timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'logIndex',
				label: 'log index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bloom',
				label: 'bloom',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'data',
				label: 'data',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'topics',
				label: 'topics',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
