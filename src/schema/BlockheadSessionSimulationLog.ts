import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum BlockheadSessionSimulationLogSelector {
	SimulationIdLogIndex = 'simulationId+logIndex',
}
export default {
	entityType: EntityType.BlockheadSessionSimulationLog,
	label: 'blockhead session simulation log',
	labelPlural: 'blockhead session simulation logs',
	selectors: [
		{
			name: BlockheadSessionSimulationLogSelector.SimulationIdLogIndex,
			fields: [
				'simulationId',
				'logIndex',
			],
		},
	],
	fields: [
		{
			name: 'simulationId',
			label: 'simulation ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'logIndex',
			label: 'log index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
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
			name: 'callPath',
			label: 'call path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'topic',
			label: 'topic',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Zero,
		},
		{
			name: 'topics',
			label: 'topics',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'dataHash',
			label: 'data hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'removed',
			label: 'removed',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
