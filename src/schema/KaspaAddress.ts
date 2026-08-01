// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.KaspaAddress,
	labels: {
		singular: 'kaspa address',
		plural: 'kaspa addresses',
	},
})({
	$network: {
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$utxos: {
		entityType: EntityType.KaspaAddressUtxo_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.KaspaAddress_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
