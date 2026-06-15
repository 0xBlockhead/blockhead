import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export enum CosmosBlockSelector {
	Height = 'height',
	Hash = 'hash',
}

export default {
	entityType: EntityType.CosmosBlock,

	label: 'Cosmos Block',
	labelPlural: 'Cosmos Blocks',

	selectors: [
		{
			name: CosmosBlockSelector.Height,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: CosmosBlockSelector.Hash,
			fields: [
				'$network',
				'hash',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proposerConsensusAddress',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
