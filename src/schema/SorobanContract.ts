// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContractSelector {
	NetworkContractId = 'NetworkContractId',
}
export default {
	entityType: EntityType.SorobanContract,
	label: 'soroban contract',
	labelPlural: 'soroban contracts',
	selectors: [
		{
			name: SorobanContractSelector.NetworkContractId,
			fields: [
				'$network',
				'contractId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'contractId',
			label: 'contract ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SorobanContract_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$storageEntries',
			label: 'storage entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SorobanContractStorageEntry,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
