// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.CosmosContract,
	label: 'Cosmos contract',
	labelPlural: 'Cosmos contracts',
	selectors: [
		{
			name: CosmosContractSelector.NetworkAddress,
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
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'codeId',
			label: 'Code ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$creator',
			label: 'Creator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$admin',
			label: 'Admin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
