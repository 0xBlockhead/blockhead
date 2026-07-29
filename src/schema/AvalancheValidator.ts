// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subnetId: {
		label: 'subnet ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	startTimeMs: {
		label: 'start time ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	endTimeMs: {
		label: 'end time ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakeAmountNavax: {
		label: 'stake amount navax',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	txId: {
		label: 'transaction ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardOwnerAddresses: {
		label: 'reward owner addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	potentialRewardNavax: {
		label: 'potential reward navax',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegationFeePercent: {
		label: 'delegation fee percent',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$subnet: {
		label: 'subnet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AvalancheSubnet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
