import { Source } from '$/sources/$Sources.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { type } from 'arktype'

export default {
	entityType: EntityType._Global,

	label: 'Global',

	id: type({}),

	fields: [
		{
			name: '$$networks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.ChainList, Source.Explorer],
		},
		{
			name: '$$networkForks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NetworkFork,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Explorer],
		},
		{
			name: '$$proposalsEips',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Eips],
		},
		{
			name: '$$proposalsErc',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Eips],
		},
		{
			name: '$$proposalsEnsip',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Ensips],
		},
		{
			name: '$$caips',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Caip,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Caips],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
