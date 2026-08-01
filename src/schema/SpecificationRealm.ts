// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SpecificationRealm,
	labels: {
		singular: 'Specification realm',
		plural: 'specification realms',
	},
})({
	realm: {
		label: 'Realm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	labelPlural: {
		label: 'Label plural',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$proposalKinds: {
		label: 'Proposal kinds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SpecificationProposalKind,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proposals: {
		label: 'Proposals',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Realm: [
			'realm',
		],
	},
})
