// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum HederaContractLogSelector {
	ResultLogIndex = 'ResultLogIndex',
	ContractConsensusTimestampLogIndex = 'ContractConsensusTimestampLogIndex',
}
export const HederaContractLog = entity({
	entityType: EntityType.HederaContractLog,
	label: 'hedera contract log',
	labelPlural: 'hedera contract logs',
})({
	$result: {
		label: 'result',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logIndex: {
		label: 'log index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bloom: {
		label: 'bloom',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'data',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topics: {
		label: 'topics',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ResultLogIndex: [
			'$result',
			'logIndex',
		],
		ContractConsensusTimestampLogIndex: [
			'$contract',
			'consensusTimestamp',
			'logIndex',
		],
	},
})
