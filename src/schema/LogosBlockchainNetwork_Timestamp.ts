// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LogosBlockchainNetwork_Timestamp,
	labels: {
		singular: 'Logos blockchain network timestamp',
		plural: 'Logos blockchain network observations',
	},
})({
	$network: {
		entityType: EntityType.LogosBlockchainNetwork,
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
	lib: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	libSlot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tip: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	height: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTimestampMsSource: [
			'$network',
			'timestampMs',
			'source',
		],
	},
})
