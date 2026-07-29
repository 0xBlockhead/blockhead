// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.KaspaNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$utxos: {
		label: 'utxos',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.KaspaAddressUtxo_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
