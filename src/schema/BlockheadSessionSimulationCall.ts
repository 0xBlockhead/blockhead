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
		label: 'simulation ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	callPath: {
		label: 'call path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$simulation: {
		label: 'simulation',
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.One,
	},
	parentCallPath: {
		label: 'parent call path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depth: {
		label: 'depth',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		label: 'call index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callType: {
		label: 'call type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		label: 'from address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputSelector: {
		label: 'input selector',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputDataHash: {
		label: 'input data hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputDataHash: {
		label: 'output data hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reverted: {
		label: 'reverted',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
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
