// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		label: 'consensus network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sharedStakingStatusSource: {
		label: 'shared staking status source',
		type: EntityFieldType.Primitive,
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
