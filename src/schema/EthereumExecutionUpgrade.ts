// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ExecutionProtocol } from '$/schema/NetworkUpgradeProtocols.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalSources = [
	Source.Constants_Internal,
] as const

export default entity({
	entityType: EntityType.EthereumExecutionUpgrade,
	labels: {
		singular: 'Ethereum execution upgrade',
		plural: 'Ethereum execution upgrades',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	upgradeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
	slug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: constantsInternalSources,
	},
	activationBlock: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	activationTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	activationEpoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: constantsInternalSources,
	},
	protocol: {
		primitiveType: type.enumerated(...Object.values(ExecutionProtocol)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	layer: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	forkHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkEthereumOrg: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkExecutionDocs: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	linkForkcast: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionSpecsPinnedMarkdownFilename: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	executionSpecsMainnetUpgradeMarkdown: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$proposals: {
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
