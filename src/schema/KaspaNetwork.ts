// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum KaspaNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.KaspaNetwork,
	label: 'kaspa network',
	labelPlural: 'kaspa networks',
	selectors: [
		{
			name: KaspaNetworkSelector.Network,
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
			entityType: EntityType.KaspaBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.KaspaTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$acceptedTransactions',
			label: 'accepted transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.KaspaAcceptedTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$addresses',
			label: 'addresses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.KaspaAddress,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.KaspaNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$virtualChainTimestamps',
			label: 'virtual chain timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.KaspaVirtualChain_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
