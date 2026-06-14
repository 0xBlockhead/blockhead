import { type } from 'arktype'
import BlockheadWallet from '$/schema/BlockheadWallet.ts'
import BlockheadWalletAccount from '$/schema/BlockheadWalletAccount.ts'
import {
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadWalletConnectionSelector {
	BlockheadWallet = 'blockheadWallet',
}


export enum BlockheadConnectionStatus {
	Disconnected = 'disconnected',
	Connecting = 'connecting',
	Connected = 'connected',
	Error = 'error',
}

export default {
	entityType: EntityType.BlockheadWalletConnection,

	label: 'Wallet Connection',
	labelPlural: 'Wallet Connections',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWallet,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BlockheadConnectionStatus),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletProtocol),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transportKind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(WalletTransportKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'scopes',
			type: EntityFieldType.Primitive,
			primitiveType: type({
				namespace: 'string',
				reference: 'string',
				methods: 'string[]',
				events: 'string[]',
			}).array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$connectedAccounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadWalletAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$activeAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWalletAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selected',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'connectedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'disconnectedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sessionId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sessionTopic',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
