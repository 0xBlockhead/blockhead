// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	resultCount: {
		label: 'Results',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	completed: {
		label: 'Completed',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.NostrBand_Rest,
		],
	},
	$$profiles: {
		label: 'Profiles',
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
