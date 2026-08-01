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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceProjectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scalingDeploymentClaimId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$rollup: {
		entityType: EntityType.EvmRollup,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.ScalingDeploymentClaim_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$settlementContracts: {
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
