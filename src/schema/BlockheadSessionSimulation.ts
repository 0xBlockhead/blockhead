// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadSessionSimulationSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadSessionSimulation,
	label: 'blockhead session simulation',
	labelPlural: 'blockhead session simulations',
	selectors: [
		{
			name: BlockheadSessionSimulationSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$session',
				label: 'session',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadSession,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the subject was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'completedAt',
				label: 'completed AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'paramsHash',
				label: 'params hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'forkBlockNumber',
				label: 'fork block number',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'forkRpcOrigin',
				label: 'fork RPC origin',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'actionCount',
				label: 'action count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'resultSummary',
				label: 'result summary',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'resultPayloadHash',
				label: 'result payload hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$calls',
				label: 'calls',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadSessionSimulationCall,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$logs',
				label: 'logs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadSessionSimulationLog,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
