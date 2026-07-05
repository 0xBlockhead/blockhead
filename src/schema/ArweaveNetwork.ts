// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ArweaveNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.ArweaveNetwork,
	label: 'arweave network',
	labelPlural: 'arweave networks',
	selectors: [
		{
			name: ArweaveNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$blocks',
				label: 'blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveBlock,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$resources',
				label: 'resources',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveResource,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
