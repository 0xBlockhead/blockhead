// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const substrateSidecarRestSources = [
	Source.SubstrateSidecar_Rest,
] as const

export default entity({
	entityType: EntityType.PolkadotAccount_Timestamp,
	labels: {
		singular: 'Polkadot account timestamp',
		plural: 'Polkadot account observations',
	},
})({
	$account: {
		entityType: EntityType.PolkadotAccount,
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
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: substrateSidecarRestSources,
	},
	freeBalancePlancks: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: substrateSidecarRestSources,
	},
})({
	selectors: {
		AccountTimestampMsSource: [
			'$account',
			'timestampMs',
			'source',
		],
	},
})
