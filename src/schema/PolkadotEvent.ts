// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotEventSelector {
	BlockIndexInBlock = 'BlockIndexInBlock',
}
export const PolkadotEvent = entity({
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
		primitiveType: (type('number.integer >= 0')),
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
