// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum UtxoAddressSelector {
	NetworkAddress = 'NetworkAddress',
}
export const UtxoAddress = entity({
	entityType: EntityType.UtxoAddress,
	labels: {
		singular: 'UTXO address',
		plural: 'UTXO addresses',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.UtxoAddress_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'Outputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'Transactions',
		type: EntityFieldType.EntitiesReference,
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
