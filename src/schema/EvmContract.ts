// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmContractSelector {
	EvmNetworkAddress = 'EvmNetworkAddress',
}
export const EvmContract = entity({
	entityType: EntityType.EvmContract,
	label: 'EVM contract',
	labelPlural: 'EVM contracts',
	description: 'A smart contract account and its contract-specific metadata on an EVM-compatible network.',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	precompileName: {
		label: 'Precompile name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$deployer: {
		label: 'Deployer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$creationTransaction: {
		label: 'Creation transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$implementation: {
		label: 'Implementation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	codeHash: {
		label: 'Code hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	code: {
		label: 'Code',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abi: {
		label: 'ABI',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageSlotReads: {
		label: 'Storage slot reads',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'slot': type('string'), 'value': type('string') }),
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageReads: {
		label: 'Storage reads',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmStorageRead_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$verification: {
		label: 'Verification',
		type: EntityFieldType.EntityReference,
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
