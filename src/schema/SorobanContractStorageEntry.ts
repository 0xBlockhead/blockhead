// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContractStorageEntrySelector {
	ContractKeyHash = 'ContractKeyHash',
}
export default {
	entityType: EntityType.SorobanContractStorageEntry,
	label: 'soroban contract storage entry',
	labelPlural: 'soroban contract storage entries',
	selectors: [
		{
			name: SorobanContractStorageEntrySelector.ContractKeyHash,
			fields: [
				'$contract',
				'keyHash',
			],
		},
	],
	fields: [
		{
				name: '$contract',
				label: 'contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SorobanContract,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'keyHash',
				label: 'key hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'key',
				label: 'key',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SorobanContractStorageEntry_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
