// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmRollup,
	labels: {
		singular: 'EVM rollup',
		plural: 'EVM rollups',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	projectId: {
		label: 'Project ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$settlementNetwork: {
		label: 'Settlement network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	type: {
		label: 'Type',
		description: 'The source-domain type or category.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	category: {
		label: 'Category',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	hostChain: {
		label: 'Host chain',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.EvmRollup_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkProjectId: [
			'$network',
			'projectId',
		],
	},
})
