import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ProposalCategory, ProposalRealm } from '$/constants/Proposal.ts'

export default {
	entityType: EntityType.ProposalKind,

	label: 'Proposal kind',
	labelPlural: 'Proposal kinds',

	id: type({
		realm: type.valueOf(ProposalRealm),
		category: type.valueOf(ProposalCategory),
	}),

	fields: [
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'labelPlural',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$proposalRealm',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ProposalRealm,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$proposals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Proposal,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

