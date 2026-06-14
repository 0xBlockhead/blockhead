import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ProposalCategory, SpecificationRealm } from '$/constants/SpecificationProposal.ts'

export enum SpecificationProposalSelector {
	RealmCategoryNumber = 'realmCategoryNumber',
}

export default {
	entityType: EntityType.SpecificationProposal,

	label: 'Proposal',
	labelPlural: 'Proposals',

	selectors: [
		{
			name: SpecificationProposalSelector.RealmCategoryNumber,
			fields: [
				'realm',
				'category',
				'number',
			],
		},
	],

	fields: [
		{
			name: 'realm',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(SpecificationRealm),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'category',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ProposalCategory),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'number',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'documentCategory',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'documentTitle',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'documentStatus',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'documentBody',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
