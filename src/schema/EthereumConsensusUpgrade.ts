// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EthereumConsensusUpgrade,
	labels: {
		singular: 'Ethereum consensus upgrade',
		plural: 'Ethereum consensus upgrades',
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
	previousForkVersion: {
		label: 'Previous fork version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	currentForkVersion: {
		label: 'Current fork version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocol: {
		label: 'Consensus fork',
		primitiveType: type.enumerated(...Object.values(ConsensusProtocol)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkEthereumOrg: {
		label: 'Ethereum.org',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkConsensusDocs: {
		label: 'Consensus docs',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkForkcast: {
		label: 'Forkcast',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$proposals: {
		label: 'Specification proposals',
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
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
