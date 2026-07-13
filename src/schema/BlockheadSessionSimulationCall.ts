// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadSessionSimulationCallSelector {
	SimulationIdCallPath = 'SimulationIdCallPath',
}
export const BlockheadSessionSimulationCall = entity({
	entityType: EntityType.BlockheadSessionSimulationCall,
	labels: {
		singular: 'blockhead session simulation call',
		plural: 'blockhead session simulation calls',
	},
})({
	simulationId: {
		label: 'simulation ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	callPath: {
		label: 'call path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$simulation: {
		label: 'simulation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadSessionSimulation,
		cardinality: EntityFieldCardinality.One,
	},
	parentCallPath: {
		label: 'parent call path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depth: {
		label: 'depth',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		label: 'call index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callType: {
		label: 'call type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		label: 'from address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputSelector: {
		label: 'input selector',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputDataHash: {
		label: 'input data hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputDataHash: {
		label: 'output data hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reverted: {
		label: 'reverted',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
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
