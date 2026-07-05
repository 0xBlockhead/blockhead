// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NearContractStorageEntrySelector {
	ContractKeyBlockHeightSource = 'ContractKeyBlockHeightSource',
}
export default {
	entityType: EntityType.NearContractStorageEntry,
	label: 'near contract storage entry',
	labelPlural: 'near contract storage entries',
	selectors: [
		{
			name: NearContractStorageEntrySelector.ContractKeyBlockHeightSource,
			fields: [
				'$contract',
				'keyBase64',
				'blockHeight',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$contract',
				label: 'Contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearContract,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'keyBase64',
				label: 'Key base64',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockHeight',
				label: 'Block height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockHash',
				label: 'Block hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueBase64',
				label: 'Value base64',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueHash',
				label: 'Value hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'prefixBase64',
				label: 'Prefix base64',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'deleted',
				label: 'Deleted',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
