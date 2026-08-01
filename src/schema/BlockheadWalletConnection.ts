// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletConnection,
	labels: {
		singular: 'wallet connection',
		plural: 'wallet connections',
	},
})({
	connectionKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		primitiveType: type.enumerated(...Object.values(BlockheadConnectionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scopes: {
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			methods: type('string').array(),
			events: type('string').array(),
		}).array(),
		cardinality: EntityFieldCardinality.One,
	},
	selected: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	connectedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disconnectedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionTopic: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$accounts: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.Many,
	},
	$activeAccount: {
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ConnectionKey: [
			'connectionKey',
		],
	},
})
