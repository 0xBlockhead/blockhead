// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, EvmTopicHash, Hash32 } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSessionSimulationLog,
	labels: {
		singular: 'blockhead session simulation log',
		plural: 'blockhead session simulation logs',
	},
})({
	simulationId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$simulation: {
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.One,
	},
	callPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topic0: {
		primitiveType: EvmTopicHash,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topics: {
		primitiveType: EvmTopicHash,
		cardinality: EntityFieldCardinality.Many,
	},
	dataHash: {
		primitiveType: Hash32,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decodedEventName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decodedArgs: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	removed: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SimulationIdLogIndex: [
			'simulationId',
			'logIndex',
		],
	},
})
