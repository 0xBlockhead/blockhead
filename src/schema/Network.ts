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

	id: type({
		chainId: 'number',
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.ChainList, Source.Explorer],
		},
		{
			name: 'nativeSymbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.ChainList, Source.Explorer],
		},
		{
			name: 'explorerOrigin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.ChainList, Source.Explorer],
		},
		{
			name: 'rpcUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.ChainList, Source.Explorer],
		},
		{
			name: '$$forks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkFork,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Explorer],
		},
		{
			name: '$$evmBlocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Explorer],
		},
		{
			name: '$$evmTransactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Explorer],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

