// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotReferendum,
	labels: {
		singular: 'Polkadot referendum',
		plural: 'Polkadot referendums',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	referendumId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	track: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	submittedAtBlockNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.PolkadotReferendum_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Subscan_Rest,
		],
	},
})({
	selectors: {
		NetworkReferendumId: [
			'$network',
			'referendumId',
		],
	},
})
