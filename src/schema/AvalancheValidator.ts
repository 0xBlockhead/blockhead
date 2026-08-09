// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheValidator,
	labels: {
		singular: 'avalanche validator',
		plural: 'avalanche validators',
	},
})({
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subnetId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	startTimeMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	endTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	stakeAmountNavax: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	txId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	rewardOwnerAddresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	potentialRewardNavax: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	delegationFeePercent: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	$subnet: {
		entityType: EntityType.AvalancheSubnet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	$$timestamps: {
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
