// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EigenLayerOperatorSelector {
	NetworkOperatorAddress = 'NetworkOperatorAddress',
}
export default {
	entityType: EntityType.EigenLayerOperator,
	label: 'eigen layer operator',
	labelPlural: 'eigen layer operators',
	selectors: [
		{
			name: EigenLayerOperatorSelector.NetworkOperatorAddress,
			fields: [
				'$network',
				'operatorAddress',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'operatorAddress',
				label: 'operator address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$operatorAccount',
				label: 'operator account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'earningsReceiver',
				label: 'earnings receiver',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegationApprover',
				label: 'delegation approver',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stakerOptOutWindowBlocks',
				label: 'staker opt out window blocks',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadataUri',
				label: 'metadata URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'website',
				label: 'website',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'description',
				label: 'Description',
				description: 'A human-readable description from the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$delegations',
				label: 'delegations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerDelegation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$allocations',
				label: 'allocations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerAllocation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$rewards',
				label: 'rewards',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerReward_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$slashingEvents',
				label: 'slashing events',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EigenLayerSlashingEvent,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
