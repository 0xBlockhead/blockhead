// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetStorageEntrySelector {
	ContractStorageKey = 'ContractStorageKey',
}
export default {
	entityType: EntityType.StarknetStorageEntry,
	label: 'starknet storage entry',
	labelPlural: 'starknet storage entries',
	selectors: [
		{
			name: StarknetStorageEntrySelector.ContractStorageKey,
			fields: [
				'$contract',
				'storageKey',
			],
		},
	],
	fields: [
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StarknetContract,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'storageKey',
			label: 'storage key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetStorageEntry_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
