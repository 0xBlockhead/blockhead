// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmAccount,
	labels: {
		singular: 'EVM account',
		plural: 'EVM accounts',
	},
	description: 'An account address in the EVM address space, independent of any one chain.',
})({
	address: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	interopAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$primaryName: {
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	avatarUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avatar: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ensNamesOwned: {
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransfers: {
		entityType: EntityType.BridgeTransfer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Across_Rest,
			Source.Axelarscan_Rest,
		],
	},
})({
	selectors: {
		Address: [
			'address',
		],
		AddressInteropAddress: [
			'address',
			'interopAddress',
		],
	},
})
