// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaContractLog,
	labels: {
		singular: 'hedera contract log',
		plural: 'hedera contract logs',
	},
})({
	$result: {
		label: 'result',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
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
		primitiveType: EvmAddress,
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
