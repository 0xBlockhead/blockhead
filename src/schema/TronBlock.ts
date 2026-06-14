import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum TronBlockSelector {
	NetworkHeightHash = 'networkHeightHash',
}
import { Source } from '$/sources/Source.ts'

const tronPublicBlockSources = [
	Source.TronScan_Rest,
	Source.TronGrid_Rest,
]

export default {
	entityType: EntityType.TronBlock,

	label: 'TRON Block',
	labelPlural: 'TRON Blocks',

	selectors: [
		{
			name: TronBlockSelector.NetworkHeightHash,
			fields: [
				'$network',
				'height',
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
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'parentHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: '$witness',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronWitness,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'txTrieRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicBlockSources,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
