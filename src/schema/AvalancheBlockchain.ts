// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$subnet: {
		label: 'subnet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AvalancheSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	vmId: {
		label: 'vm ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainName: {
		label: 'chain name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chainAlias: {
		label: 'chain alias',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	genesisDataHash: {
		label: 'genesis data hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTxId: {
		label: 'created AT transaction ID',
		type: EntityFieldType.Primitive,
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
