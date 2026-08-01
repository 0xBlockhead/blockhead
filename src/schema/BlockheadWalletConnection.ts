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
		label: 'connection key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'Wallet',
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'Status',
		primitiveType: type.enumerated(...Object.values(BlockheadConnectionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		label: 'Transport',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scopes: {
		label: 'Scopes',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			methods: type('string').array(),
			events: type('string').array(),
		}).array(),
		cardinality: EntityFieldCardinality.One,
	},
	selected: {
		label: 'Selected',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	connectedAt: {
		label: 'Connected',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disconnectedAt: {
		label: 'Disconnected',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionId: {
		label: 'Session ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionTopic: {
		label: 'Session topic',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$accounts: {
		label: 'Accounts',
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.Many,
	},
	$activeAccount: {
		label: 'Active account',
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
