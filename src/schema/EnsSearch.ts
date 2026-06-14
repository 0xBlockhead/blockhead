import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum EnsSearchSelector {
	Query = 'query',
}

export default {
	entityType: EntityType.EnsSearch,

	label: 'ENS search',
	labelPlural: 'ENS searches',

	selectors: [
		{
			name: EnsSearchSelector.Query,
			fields: [
				'query',
			],
		},
	],

	fields: [
		{
			name: 'query',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$ensNames',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TheGraph_Graphql,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
