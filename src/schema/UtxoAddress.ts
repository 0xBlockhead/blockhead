// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoAddress,
	labels: {
		singular: 'UTXO address',
		plural: 'UTXO addresses',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.UtxoAddress_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'Outputs',
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'Transactions',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MempoolSpace_Rest,
		],
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
