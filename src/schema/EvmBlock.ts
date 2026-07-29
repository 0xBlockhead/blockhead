// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmBlock,
	labels: {
		singular: 'EVM block',
		plural: 'EVM blocks',
	},
	description: 'A block in an EVM-compatible execution chain.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	parentHash: {
		label: 'Parent hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		label: 'Parent block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$miner: {
		label: 'Miner / validator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'Gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		label: 'Gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	baseFeePerGas: {
		label: 'Base fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blobGasUsed: {
		label: 'Blob gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	excessBlobGas: {
		label: 'Excess blob gas',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		label: 'Transactions',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'Transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkBlockNumber: [
			'$network',
			'blockNumber',
		],
		EvmNetworkBlockHash: [
			'$network',
			'hash',
		],
	},
})
