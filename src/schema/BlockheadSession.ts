// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadSessionStatus {
	Draft = 'Draft',
	Submitted = 'Submitted',
	Finalized = 'Finalized',
}
export enum BlockheadSessionSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadSession,
	label: 'session',
	labelPlural: 'sessions',
	selectors: [
		{
			name: BlockheadSessionSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
				name: 'id',
				label: 'ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(BlockheadSessionStatus)),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'createdAt',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'updatedAt',
				label: 'Updated',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'lockedAt',
				label: 'Locked',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$latestSimulation',
				label: 'Latest simulation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadSessionSimulation,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'simulationCount',
				label: 'Simulation count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$actions',
				label: 'Actions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadSessionAction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$simulations',
				label: 'Simulations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadSessionSimulation,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
