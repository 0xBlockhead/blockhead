// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWallet,
	labels: {
		singular: 'blockhead wallet',
		plural: 'blockhead wallets',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	icon: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	discoveryKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rdns: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	capabilities: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	$connectionMethod: {
		entityType: EntityType.WalletConnectionMethod,
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
