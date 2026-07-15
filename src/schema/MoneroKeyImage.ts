// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MoneroKeyImageSelector {
	MoneroTransactionInputIndexKeyImage = 'MoneroTransactionInputIndexKeyImage',
}
export const MoneroKeyImage = entity({
	entityType: EntityType.MoneroKeyImage,
	labels: {
		singular: 'monero key image',
		plural: 'monero key images',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	inputIndex: {
		label: 'Input index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	keyImage: {
		label: 'Key image',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$ring: {
		label: 'Ring',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MoneroRing,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	},
})({
	selectors: {
		MoneroTransactionInputIndexKeyImage: [
			'$transaction',
			'inputIndex',
			'keyImage',
		],
	},
})
