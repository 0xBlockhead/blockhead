import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum TronAccountSelector {
	NetworkAddress = 'networkAddress',
}
import { Source } from '$/sources/Source.ts'

const tronPublicAccountSources = [
	Source.TronScan_Rest,
	Source.TronGrid_Rest,
]

export default {
	entityType: EntityType.TronAccount,

	label: 'TRON Account',
	labelPlural: 'TRON Accounts',

	selectors: [
		{
			name: TronAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicAccountSources,
		},
		{
			name: 'balanceSun',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicAccountSources,
		},
		{
			name: 'createdTimestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicAccountSources,
		},
		{
			name: 'latestOperationTimestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: tronPublicAccountSources,
		},
		{
			name: 'totalTransactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'bandwidthRemaining',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'energyRemaining',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: 'isContract',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$$tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronScan_Rest,
				Source.TronGrid_Rest,
			],
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TronGrid_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
