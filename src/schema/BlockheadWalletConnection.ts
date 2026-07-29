// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'Wallet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BlockheadConnectionStatus)),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'Protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		label: 'Transport',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	scopes: {
		label: 'Scopes',
		type: EntityFieldType.Primitive,
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
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	connectedAt: {
		label: 'Connected',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disconnectedAt: {
		label: 'Disconnected',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionId: {
		label: 'Session ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionTopic: {
		label: 'Session topic',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$accounts: {
		label: 'Accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.Many,
	},
	$activeAccount: {
		label: 'Active account',
		type: EntityFieldType.EntityReference,
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
