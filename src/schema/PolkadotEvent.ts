// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.PolkadotEvent,
	labels: {
		singular: 'Polkadot event',
		plural: 'Polkadot events',
	},
})({
	$block: {
		entityType: EntityType.PolkadotBlock,
		cardinality: EntityFieldCardinality.One,
	},
	indexInBlock: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$extrinsic: {
		entityType: EntityType.PolkadotExtrinsic,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$pallet: {
		entityType: EntityType.PolkadotPallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		BlockIndexInBlock: [
			'$block',
			'indexInBlock',
		],
	},
})
