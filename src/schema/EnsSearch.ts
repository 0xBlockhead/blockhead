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
	entityType: EntityType.EnsSearch,

	label: 'ENS search',
	labelPlural: 'ENS searches',

	id: type({
		query: 'string',
	}),

	fields: [
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
