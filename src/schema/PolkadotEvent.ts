// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotBlock,
		cardinality: EntityFieldCardinality.One,
	},
	indexInBlock: {
		label: 'Index in block',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$extrinsic: {
		label: 'Extrinsic',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotExtrinsic,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$pallet: {
		label: 'Pallet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.PolkadotPallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventName: {
		label: 'Event name',
		type: EntityFieldType.Primitive,
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
