// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceProjectId: {
		label: 'Source project ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scalingDeploymentClaimId: {
		label: 'Scaling deployment claim ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$rollup: {
		label: 'Rollup',
		entityType: EntityType.EvmRollup,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.ScalingDeploymentClaim_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$settlementContracts: {
		label: 'Settlement contracts',
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
