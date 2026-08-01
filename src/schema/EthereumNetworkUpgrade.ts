// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EthereumNetworkUpgrade,
	labels: {
		singular: 'Ethereum network upgrade',
		plural: 'Ethereum network upgrades',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	upgradeId: {
		label: 'Upgrade ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	activationBlock: {
		label: 'Activation block',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activationTimestampMs: {
		label: 'Activation time',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activationEpoch: {
		label: 'Activation epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$networkExecutionUpgrade: {
		label: 'Execution layer',
		entityType: EntityType.EthereumExecutionUpgrade,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$networkConsensusUpgrade: {
		label: 'Consensus layer',
		entityType: EntityType.EthereumConsensusUpgrade,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$proposals: {
		label: 'Specification proposals',
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
})({
	selectors: {
		EvmNetworkUpgradeId: [
			'$network',
			'upgradeId',
		],
		EvmNetworkSlug: [
			'$network',
			'slug',
		],
	},
})
