// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheBlockchain,
	labels: {
		singular: 'avalanche blockchain',
		plural: 'avalanche blockchains',
	},
})({
	blockchainId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$subnet: {
		entityType: EntityType.AvalancheSubnet,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	vmId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	chainName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	chainAlias: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	genesisDataHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTxId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BlockchainId: [
			'blockchainId',
		],
	},
})
