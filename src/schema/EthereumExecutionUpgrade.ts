// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ExecutionProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EthereumExecutionUpgrade,
	labels: {
		singular: 'Ethereum execution upgrade',
		plural: 'Ethereum execution upgrades',
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
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	activationBlock: {
		label: 'Activation block',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	activationTimestampMs: {
		label: 'Activation time',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	activationEpoch: {
		label: 'Activation epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	protocol: {
		label: 'Execution fork',
		primitiveType: type.enumerated(...Object.values(ExecutionProtocol)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	layer: {
		label: 'Layer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forkHash: {
		label: 'Fork hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkEthereumOrg: {
		label: 'Ethereum.org',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkExecutionDocs: {
		label: 'Execution docs',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkForkcast: {
		label: 'Forkcast',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionSpecsPinnedMarkdownFilename: {
		label: 'Execution specs markdown',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionSpecsMainnetUpgradeMarkdown: {
		label: 'Mainnet upgrade markdown',
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
