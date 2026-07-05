// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearAccountSelector {
	NetworkAccountId = 'NetworkAccountId',
}
export default {
	entityType: EntityType.NearAccount,
	label: 'near account',
	labelPlural: 'near accounts',
	selectors: [
		{
			name: NearAccountSelector.NetworkAccountId,
			fields: [
				'$network',
				'accountId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountId',
				label: 'Account ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'amountYoctoNear',
				label: 'Amount yocto near',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
					Source.NearBlocks_Rest,
				],
		},
		{
				name: 'storageUsageBytes',
				label: 'Storage usage bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: '$contract',
				label: 'Contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NearContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
		{
				name: '$$accessKeys',
				label: 'Access keys',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NearAccessKey,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.NearRpc_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
