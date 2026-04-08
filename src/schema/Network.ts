import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityType: EntityType.Network,

	label: 'Network',
	labelPlural: 'Networks',

	id: type({
		chainId: 'number',
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.ChainList, Source.Blockscout],
		},
		{
			name: 'nativeSymbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.ChainList, Source.Blockscout],
		},
		{
			name: 'explorerOrigin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.ChainList, Source.Blockscout],
		},
		{
			name: 'rpcUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.ChainList, Source.Blockscout],
		},
		{
			name: 'lifiKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.LiFi],
		},
		{
			name: '$$forks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkFork,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source._Constants],
		},
		{
			name: '$$evmBlocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Blockscout],
		},
		{
			name: '$$evmTransactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Blockscout],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

