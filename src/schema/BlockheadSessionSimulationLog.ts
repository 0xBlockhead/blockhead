// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSessionSimulationLog,
	labels: {
		singular: 'blockhead session simulation log',
		plural: 'blockhead session simulation logs',
	},
})({
	simulationId: {
		label: 'simulation ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	logIndex: {
		label: 'log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$simulation: {
		label: 'simulation',
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.One,
	},
	callPath: {
		label: 'call path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topic0: {
		label: 'topic0',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topics: {
		label: 'topics',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.Many,
	},
	dataHash: {
		label: 'data hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decodedEventName: {
		label: 'decoded event name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decodedArgs: {
		label: 'decoded args',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	removed: {
		label: 'removed',
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
