import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadSessionStatus {
	Draft = 'Draft',
	Submitted = 'Submitted',
	Finalized = 'Finalized',
}
export enum BlockheadSessionSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.BlockheadSession,
	label: 'blockhead session',
	labelPlural: 'blockhead sessions',
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
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lockedAt',
			label: 'locked AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$latestSimulation',
			label: 'latest simulation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSessionSimulation,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'simulationCount',
			label: 'simulation count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$actions',
			label: 'actions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadSessionAction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$intentInvocations',
			label: 'intent invocations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadIntentInvocation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$simulations',
			label: 'simulations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadSessionSimulation,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
