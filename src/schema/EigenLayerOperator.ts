// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerOperator,
	labels: {
		singular: 'eigen layer operator',
		plural: 'eigen layer operators',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	operatorAddress: {
		label: 'operator address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$operatorAccount: {
		label: 'operator account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	earningsReceiver: {
		label: 'earnings receiver',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegationApprover: {
		label: 'delegation approver',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakerOptOutWindowBlocks: {
		label: 'staker opt out window blocks',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUri: {
		label: 'metadata URI',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	website: {
		label: 'website',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegations: {
		label: 'delegations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerDelegation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$allocations: {
		label: 'allocations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerAllocation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$rewards: {
		label: 'rewards',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerReward_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$slashingEvents: {
		label: 'slashing events',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EigenLayerSlashingEvent,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkOperatorAddress: [
			'$network',
			'operatorAddress',
		],
	},
})
