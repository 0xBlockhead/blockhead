// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.UtxoNetwork,
	label: 'UTXO network',
	labelPlural: 'UTXO networks',
	selectors: [
		{
			name: UtxoNetworkSelector.Network,
			fields: [
				'$network',
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
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoBlock,
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
