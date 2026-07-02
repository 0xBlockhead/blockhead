// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoAddressSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.UtxoAddress,
	label: 'UTXO address',
	labelPlural: 'UTXO addresses',
	selectors: [
		{
			name: UtxoAddressSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoAddress_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$outputs',
				label: 'Outputs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoOutput,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transactions',
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
