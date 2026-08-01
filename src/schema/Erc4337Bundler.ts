// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4337Bundler,
	labels: {
		singular: 'ERC-4337 bundler',
		plural: 'ERC-4337 bundlers',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'Contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		entityType: EntityType.Erc4337Bundler_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$userOperations: {
		label: 'User operations',
		entityType: EntityType.EvmUserOperation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		EvmNetworkAddress: [
			'$network',
			'address',
		],
	},
})
