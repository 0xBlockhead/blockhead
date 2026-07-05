// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ScalingDeploymentClaimSelector {
	NetworkSourceSourceProjectId = 'NetworkSourceSourceProjectId',
}
export default {
	entityType: EntityType.ScalingDeploymentClaim,
	label: 'scaling deployment claim',
	labelPlural: 'scaling deployment claims',
	selectors: [
		{
			name: ScalingDeploymentClaimSelector.NetworkSourceSourceProjectId,
			fields: [
				'$network',
				'source',
				'sourceProjectId',
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
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'sourceProjectId',
				label: 'Source project ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'scalingDeploymentClaimId',
				label: 'Scaling deployment claim ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$rollup',
				label: 'Rollup',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmRollup,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ScalingDeploymentClaim_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$settlementContracts',
				label: 'Settlement contracts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
