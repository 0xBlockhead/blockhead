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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	labelPlural: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$proposalKinds: {
		entityType: EntityType.SpecificationProposalKind,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proposals: {
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
