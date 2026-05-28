import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ProposalCategory, SpecificationRealm } from '$/constants/SpecificationProposal.ts'

export default {
	entityType: EntityType.SpecificationProposal,

	label: 'Proposal',
	labelPlural: 'Proposals',

	id: type({
		realm: type.valueOf(SpecificationRealm),
		category: type.valueOf(ProposalCategory),
		number: 'number',
	}),

	fields: [
		{
			name: 'documentCategory',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'documentTitle',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'documentStatus',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'documentBody',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
