// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MoneroKeyImage,
	labels: {
		singular: 'monero key image',
		plural: 'monero key images',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.MoneroTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	inputIndex: {
		label: 'Input index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	keyImage: {
		label: 'Key image',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$ring: {
		label: 'Ring',
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
