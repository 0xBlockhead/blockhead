// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NostrNetwork,
	labels: {
		singular: 'Nostr network',
		plural: 'Nostr networks',
	},
	description: 'Compatibility protocol row for the Nostr network concept. The product-backed observed is modeled by _GlobalNostrNetwork.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'protocol name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'home URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'docs URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
