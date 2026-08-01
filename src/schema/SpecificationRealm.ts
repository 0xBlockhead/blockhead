// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	labelPlural: {
		label: 'Label plural',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$proposalKinds: {
		label: 'Proposal kinds',
		entityType: EntityType.SpecificationProposalKind,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proposals: {
		label: 'Proposals',
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
