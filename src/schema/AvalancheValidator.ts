// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvalancheValidatorSelector {
	NodeIdSubnetIdStartTimeMs = 'NodeIdSubnetIdStartTimeMs',
}
export default {
	entityType: EntityType.AvalancheValidator,
	label: 'avalanche validator',
	labelPlural: 'avalanche validators',
	selectors: [
		{
			name: AvalancheValidatorSelector.NodeIdSubnetIdStartTimeMs,
			fields: [
				'nodeId',
				'subnetId',
				'startTimeMs',
			],
		},
	],
	fields: [
		{
				name: 'nodeId',
				label: 'node ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'subnetId',
				label: 'subnet ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'startTimeMs',
				label: 'start time ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'endTimeMs',
				label: 'end time ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stakeAmountNavax',
				label: 'stake amount navax',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'txId',
				label: 'transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rewardOwnerAddresses',
				label: 'reward owner addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'potentialRewardNavax',
				label: 'potential reward navax',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegationFeePercent',
				label: 'delegation fee percent',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$subnet',
				label: 'subnet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AvalancheSubnet,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AvalancheValidator_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
