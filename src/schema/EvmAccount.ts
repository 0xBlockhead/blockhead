// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	interopAddress: {
		label: 'Interop address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$primaryName: {
		label: 'Primary name',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	avatarUrl: {
		label: 'Avatar URL',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avatar: {
		label: 'Avatar',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$ensNamesOwned: {
		label: 'ENS names owned',
		type: EntityFieldType.EntitiesReference,
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
