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
		label: 'result',
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'contract',
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logIndex: {
		label: 'log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bloom: {
		label: 'bloom',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'data',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topics: {
		label: 'topics',
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
