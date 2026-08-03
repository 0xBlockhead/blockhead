// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.NearReceipt,
	labels: {
		singular: 'near receipt',
		plural: 'near receipts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	receiptId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$predecessor: {
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$receiver: {
		entityType: EntityType.NearAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkReceiptId: [
			'$network',
			'receiptId',
		],
	},
})
