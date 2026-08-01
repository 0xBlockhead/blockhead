// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	operatorAddress: {
		label: 'operator address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$operatorAccount: {
		label: 'operator account',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	earningsReceiver: {
		label: 'earnings receiver',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegationApprover: {
		label: 'delegation approver',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakerOptOutWindowBlocks: {
		label: 'staker opt out window blocks',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataUri: {
		label: 'metadata URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	website: {
		label: 'website',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$delegations: {
		label: 'delegations',
		entityType: EntityType.EigenLayerDelegation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$allocations: {
		label: 'allocations',
		entityType: EntityType.EigenLayerAllocation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$rewards: {
		label: 'rewards',
		entityType: EntityType.EigenLayerReward_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$slashingEvents: {
		label: 'slashing events',
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
