// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadConnectionStatus {
	Disconnected = 'disconnected',
	Connecting = 'connecting',
	Connected = 'connected',
	Error = 'error',
}
export enum BlockheadWalletConnectionSelector {
	BlockheadWallet = 'BlockheadWallet',
}
export default {
	entityType: EntityType.BlockheadWalletConnection,
	label: 'wallet connection',
	labelPlural: 'wallet connections',
	selectors: [
		{
			name: BlockheadWalletConnectionSelector.BlockheadWallet,
			fields: [
				'$wallet',
			],
		},
	],
	fields: [
		{
				name: '$wallet',
				label: 'Wallet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWallet,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(BlockheadConnectionStatus)),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocol',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'transportKind',
				label: 'Transport',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'scopes',
				label: 'Scopes',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'namespace': type('string'), 'reference': type('string'), 'methods': type('string').array(), 'events': type('string').array() }).array(),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'selected',
				label: 'Selected',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'connectedAt',
				label: 'Connected',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'disconnectedAt',
				label: 'Disconnected',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sessionId',
				label: 'Session ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sessionTopic',
				label: 'Session topic',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'error',
				label: 'Error',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$connectedAccounts',
				label: 'Connected accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadWalletAccount,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$activeAccount',
				label: 'Active account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWalletAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
