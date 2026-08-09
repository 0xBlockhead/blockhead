// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
	labels: {
		singular: 'zero g consensus network timestamp',
		plural: 'zero g consensus network observations',
	},
})({
	$consensusNetwork: {
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sharedStakingStatusSource: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ConsensusNetworkTimestampMsSource: [
			'$consensusNetwork',
			'timestampMs',
			'source',
		],
	},
})
