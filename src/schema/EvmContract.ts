// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmContract,
	labels: {
		singular: 'EVM contract',
		plural: 'EVM contracts',
	},
	description: 'A smart contract account and its contract-specific metadata on an EVM-compatible network.',
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	precompileName: {
		label: 'Precompile name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$deployer: {
		label: 'Deployer',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$creationTransaction: {
		label: 'Creation transaction',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$implementation: {
		label: 'Implementation',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codeHash: {
		label: 'Code hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'Code',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abi: {
		label: 'ABI',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageSlotReads: {
		label: 'Storage slot reads',
		primitiveType: type({
			slot: type('string'),
			value: type('string'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageReads: {
		label: 'Storage reads',
		entityType: EntityType.EvmStorageRead_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$verification: {
		label: 'Verification',
		entityType: EntityType.EvmContractVerification,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmNetworkAddress: [
			'$network',
			'address',
		],
	},
})
