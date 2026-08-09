// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BittensorBlock,
	labels: {
		singular: 'Bittensor block',
		plural: 'Bittensor blocks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		entityType: EntityType.BittensorBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extrinsicsRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	extrinsicCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkBlockNumberHash: [
			'$network',
			'blockNumber',
			'hash',
		],
	},
})
