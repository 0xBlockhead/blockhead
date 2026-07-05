// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.StarknetContract,
	label: 'starknet contract',
	labelPlural: 'starknet contracts',
	selectors: [
		{
			name: StarknetContractSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StarknetNetwork,
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
				name: '$$accountStates',
				label: 'account states',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StarknetAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$storage',
				label: 'storage',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StarknetStorageEntry,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$events',
				label: 'events',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StarknetEvent,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StarknetTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
