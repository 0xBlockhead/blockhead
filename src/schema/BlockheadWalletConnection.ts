import { type } from 'arktype'
import BlockheadWallet from '$/schema/BlockheadWallet.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

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

	id: type({
		$wallet: BlockheadWallet.id,
	}),

	fields: [
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BlockheadConnectionStatus),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$connectedActors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$activeActor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
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
			name: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
