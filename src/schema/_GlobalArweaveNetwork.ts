// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalArweaveNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalArweaveNetwork,
	label: 'global Arweave network',
	labelPlural: 'global Arweave networks',
	selectors: [
		{
			name: _GlobalArweaveNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this hub row.',
				type: EntityFieldType.Primitive,
				primitiveType: type.unit('_GlobalArweaveNetwork'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$sourceWindowNetworks',
				label: 'Source-window networks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveNetwork,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowBlocks',
				label: 'Source-window blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveBlock,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowTransactions',
				label: 'Source-window transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowResources',
				label: 'Source-window resources',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ArweaveResource,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalArweaveNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
