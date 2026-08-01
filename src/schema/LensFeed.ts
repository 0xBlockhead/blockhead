// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensFeed,
	labels: {
		singular: 'Lens feed',
		plural: 'Lens feeds',
	},
})({
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		label: 'Owner',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rules: {
		label: 'Rules',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$posts: {
		label: 'Posts',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Address: [
			'address',
		],
	},
})
