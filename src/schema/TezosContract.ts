// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.TezosContract,
	label: 'tezos contract',
	labelPlural: 'tezos contracts',
	selectors: [
		{
			name: TezosContractSelector.NetworkAddress,
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
			entityType: EntityType.TezosNetwork,
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
			name: 'scriptHash',
			label: 'script hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'codeHash',
			label: 'code hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storageType',
			label: 'storage type',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parameterType',
			label: 'parameter type',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$script',
			label: 'script',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosMichelsonScript,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$entrypoints',
			label: 'entrypoints',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosEntrypoint,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$bigMaps',
			label: 'big maps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosBigMap,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$operations',
			label: 'operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosContract_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
