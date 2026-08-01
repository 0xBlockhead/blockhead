// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadSessionSimulationCall,
	labels: {
		singular: 'blockhead session simulation call',
		plural: 'blockhead session simulation calls',
	},
})({
	simulationId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	callPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$simulation: {
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.One,
	},
	parentCallPath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depth: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputSelector: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputDataHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputDataHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reverted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SimulationIdCallPath: [
			'simulationId',
			'callPath',
		],
	},
})
