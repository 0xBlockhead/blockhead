// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosGovernanceProposal,
	labels: {
		singular: 'Cosmos governance proposal',
		plural: 'Cosmos governance proposals',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	proposalId: {
		label: 'Proposal ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	summary: {
		label: 'Summary',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadata: {
		label: 'Metadata',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.CosmosGovernanceProposal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CosmosSdk_Rest,
		],
	},
})({
	selectors: {
		NetworkProposalId: [
			'$network',
			'proposalId',
		],
	},
})
