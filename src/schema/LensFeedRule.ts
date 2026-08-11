// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensFeedRule,
	labels: {
		singular: 'Lens feed rule',
		plural: 'Lens feed rules',
	},
})({
	$feed: {
		entityType: EntityType.LensFeed,
		cardinality: EntityFieldCardinality.One,
	},
	ruleId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ruleType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	requirement: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	executesOn: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	configurationKinds: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		FeedRuleId: [
			'$feed',
			'ruleId',
		],
	},
})
