import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.EnsName,

	label: 'ENS Name',
	labelPlural: 'ENS Names',

	id: type({
		name: 'string',
	}),

	fields: [
		{
			name: 'labelName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'labelhash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: '$resolvedActor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire_JsonRpc],
		},
		{
			name: '$resolverContract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire_JsonRpc],
		},
		{
			name: '$ownerActor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire_JsonRpc],
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: '$$subdomains',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'subdomainCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'textRecords',
			type: EntityFieldType.Primitive,
			primitiveType: type.Record(type.string, type.string),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire_JsonRpc],
		},
		{
			name: 'contentHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire_JsonRpc, Source.TheGraph_Graphql],
		},
		{
			name: 'coinAddresses',
			type: EntityFieldType.Primitive,
			primitiveType: type.Record(type.string, type.string),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire_JsonRpc],
		},
		{
			name: 'resolverTextKeys',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'resolverCoinTypes',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'ttl',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'isMigrated',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
		{
			name: 'expiryDate',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.TheGraph_Graphql],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
