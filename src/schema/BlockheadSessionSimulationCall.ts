// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadSessionSimulationCallSelector {
	SimulationIdCallPath = 'SimulationIdCallPath',
}
export default {
	entityType: EntityType.BlockheadSessionSimulationCall,
	label: 'blockhead session simulation call',
	labelPlural: 'blockhead session simulation calls',
	selectors: [
		{
			name: BlockheadSessionSimulationCallSelector.SimulationIdCallPath,
			fields: [
				'simulationId',
				'callPath',
			],
		},
	],
	fields: [
		{
				name: 'simulationId',
				label: 'simulation ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'callPath',
				label: 'call path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$simulation',
				label: 'simulation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadSessionSimulation,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'parentCallPath',
				label: 'parent call path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'depth',
				label: 'depth',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'callIndex',
				label: 'call index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'callType',
				label: 'call type',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fromAddress',
				label: 'from address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'toAddress',
				label: 'to address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'inputSelector',
				label: 'input selector',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'inputDataHash',
				label: 'input data hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'outputDataHash',
				label: 'output data hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gasUsed',
				label: 'gas used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reverted',
				label: 'reverted',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
