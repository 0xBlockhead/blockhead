// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bloom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topics: {
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
