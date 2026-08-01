// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalancheBlockchain,
	labels: {
		singular: 'avalanche blockchain',
		plural: 'avalanche blockchains',
	},
})({
	blockchainId: {
		label: 'blockchain ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$subnet: {
		label: 'subnet',
		entityType: EntityType.AvalancheSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	vmId: {
		label: 'vm ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainName: {
		label: 'chain name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chainAlias: {
		label: 'chain alias',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	genesisDataHash: {
		label: 'genesis data hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTxId: {
		label: 'created AT transaction ID',
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
