import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'
import { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'

export default {
	entityType: EntityType.Proposal,

	label: 'Proposal',
	labelPlural: 'Proposals',

	id: type({
		realm: type.valueOf(ProposalRealm),
		category: type.valueOf(ProposalCategory),
		number: 'number',
	}),

	fields: [
		{
			name: 'category',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'body',
			type: EntityFieldType.Primitive,
			primitiveType: type('string | null'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
