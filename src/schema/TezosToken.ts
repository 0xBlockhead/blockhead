// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosTokenSelector {
	NetworkContractAddressTokenId = 'NetworkContractAddressTokenId',
}
export default {
	entityType: EntityType.TezosToken,
	label: 'tezos token',
	labelPlural: 'tezos tokens',
	selectors: [
		{
			name: TezosTokenSelector.NetworkContractAddressTokenId,
			fields: [
				'$network',
				'contractAddress',
				'tokenId',
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
				name: 'contractAddress',
				label: 'contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'standard',
				label: 'standard',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$contract',
				label: 'contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosToken_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$balanceTimestamps',
				label: 'balance timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosTokenBalance_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$transfers',
				label: 'transfers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosTokenTransfer,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
