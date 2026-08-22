// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Erc4337SmartAccount,
	labels: {
		singular: 'ERC-4337 smart account',
		plural: 'ERC-4337 smart accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	$factory: {
		entityType: EntityType.Erc4337AccountFactory,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	userOperationsCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockscout_Rest,
		],
	},
	$$userOperations: {
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
