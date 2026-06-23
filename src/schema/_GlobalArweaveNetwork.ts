import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalArweaveNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalArweaveNetwork,
	label: 'global arweave network',
	labelPlural: 'global arweave networks',
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
			primitiveType: type("'_GlobalArweaveNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowNetworks',
			label: 'source window networks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ArweaveNetwork,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowBlocks',
			label: 'source window blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ArweaveBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowTransactions',
			label: 'source window transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ArweaveTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowResources',
			label: 'source window resources',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ArweaveResource,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalArweaveNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
