// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	interopAddress: {
		label: 'Interop address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$primaryName: {
		label: 'Primary name',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	avatarUrl: {
		label: 'Avatar URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avatar: {
		label: 'Avatar',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ensNamesOwned: {
		label: 'ENS names owned',
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.Many,
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
