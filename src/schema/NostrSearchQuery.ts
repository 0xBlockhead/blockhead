// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrSearchQuery,
	labels: {
		singular: 'Nostr profile search',
		plural: 'Nostr profile searches',
	},
	description: 'A bounded NostrBand profile search addressed by its normalized query.',
})({
	query: {
		label: 'Query',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	resultCount: {
		label: 'Results',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	completed: {
		label: 'Completed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$$profiles: {
		label: 'Profiles',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NostrProfile,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
})({
	selectors: {
		Query: [
			'query',
		],
	},
})
