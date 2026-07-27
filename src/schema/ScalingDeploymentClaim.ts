// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ScalingDeploymentClaim,
	labels: {
		singular: 'scaling deployment claim',
		plural: 'scaling deployment claims',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceProjectId: {
		label: 'Source project ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scalingDeploymentClaimId: {
		label: 'Scaling deployment claim ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$rollup: {
		label: 'Rollup',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmRollup,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ScalingDeploymentClaim_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$settlementContracts: {
		label: 'Settlement contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkSourceSourceProjectId: [
			'$network',
			'source',
			'sourceProjectId',
		],
	},
})
