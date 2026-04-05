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
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$activeActor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
