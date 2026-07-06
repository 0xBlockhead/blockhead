// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.TronContract,
	label: 'tron contract',
	labelPlural: 'tron contracts',
	selectors: [
		{
			name: TronContractSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			label: 'Address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'Account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronGrid_Rest,
				Source.TronScan_Rest,
			],
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$creator',
			label: 'Creator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$creationTransaction',
			label: 'Creation transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TronTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronContract_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
		{
			name: '$$tokens',
			label: 'Tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TronToken,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.TronScan_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
