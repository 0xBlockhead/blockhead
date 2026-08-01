// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheValidator,
	labels: {
		singular: 'avalanche validator',
		plural: 'avalanche validators',
	},
})({
	nodeId: {
		label: 'node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subnetId: {
		label: 'subnet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	startTimeMs: {
		label: 'start time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	endTimeMs: {
		label: 'end time ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakeAmountNavax: {
		label: 'stake amount navax',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardOwnerAddresses: {
		label: 'reward owner addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	potentialRewardNavax: {
		label: 'potential reward navax',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegationFeePercent: {
		label: 'delegation fee percent',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$subnet: {
		label: 'subnet',
		entityType: EntityType.AvalancheSubnet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.AvalancheValidator_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NodeIdSubnetIdStartTimeMs: [
			'nodeId',
			'subnetId',
			'startTimeMs',
		],
	},
})
