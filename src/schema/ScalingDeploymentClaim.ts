import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ScalingDeploymentClaimSelector {
	NetworkSourceSourceProjectId = '$network+source+sourceProjectId',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceProjectId',
			label: 'source project ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'scalingDeploymentClaimId',
			label: 'scaling deployment claim ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$rollup',
			label: 'rollup',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmRollup,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ScalingDeploymentClaim_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$settlementContracts',
			label: 'settlement contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
