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
		label: 'Block',
		entityType: EntityType.PolkadotBlock,
		cardinality: EntityFieldCardinality.One,
	},
	indexInBlock: {
		label: 'Index in block',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$extrinsic: {
		label: 'Extrinsic',
		entityType: EntityType.PolkadotExtrinsic,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$pallet: {
		label: 'Pallet',
		entityType: EntityType.PolkadotPallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventName: {
		label: 'Event name',
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
