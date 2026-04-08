import type { Type } from 'arktype'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	type EntityDefinition as EntityDefinitionTemplate,
	type EntityFieldDefinition as EntityFieldDefinitionTemplate,
} from '$/schema/$EntityDefinition.ts'

import _GlobalSchema from '$/schema/_Global.ts'
import ActorSchema from '$/schema/Actor.ts'
import ActorCoinSchema from '$/schema/ActorCoin.ts'
import ActorCoinAllowanceSchema from '$/schema/ActorCoinAllowance.ts'
import ActorNetworkSchema from '$/schema/ActorNetwork.ts'
import BeaconActionSchema from '$/schema/BeaconAction.ts'
import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
import BeaconQueueSchema from '$/schema/BeaconQueue.ts'
import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
import BeaconValidatorSchema from '$/schema/BeaconValidator.ts'
import BlockheadAgentConversationSchema from '$/schema/BlockheadAgentConversation.ts'
import BlockheadAgentConversationTurnSchema from '$/schema/BlockheadAgentConversationTurn.ts'
import BlockheadFarcasterAccountConnectionSchema from '$/schema/BlockheadFarcasterAccountConnection.ts'
import BlockheadPanelTreeSchema from '$/schema/BlockheadPanelTree.ts'
import BlockheadRoomSchema from '$/schema/BlockheadRoom.ts'
import BlockheadRoomPeerSchema from '$/schema/BlockheadRoomPeer.ts'
import BlockheadSessionSchema from '$/schema/BlockheadSession.ts'
import BlockheadSessionSimulationSchema from '$/schema/BlockheadSessionSimulation.ts'
import BlockheadSharedAddressSchema from '$/schema/BlockheadSharedAddress.ts'
import BlockheadSiweChallengeSchema from '$/schema/BlockheadSiweChallenge.ts'
import BlockheadSocialPostSessionSchema from '$/schema/BlockheadSocialPostSession.ts'
import BlockheadSourceSchema from '$/schema/BlockheadSource.ts'
import BlockheadTransferRequestSchema from '$/schema/BlockheadTransferRequest.ts'
import BlockheadWalletSchema from '$/schema/BlockheadWallet.ts'
import BlockheadWalletConnectionSchema from '$/schema/BlockheadWalletConnection.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import BridgeRouteStepSchema from '$/schema/BridgeRouteStep.ts'
import BridgeTransactionSchema from '$/schema/BridgeTransaction.ts'
import CaipSchema from '$/schema/Caip.ts'
import CctpAllowanceSchema from '$/schema/CctpAllowance.ts'
import CctpFeeSchema from '$/schema/CctpFee.ts'
import ChannelProposalSchema from '$/schema/ChannelProposal.ts'
import CoinSchema from '$/schema/Coin.ts'
import CoinInstanceSchema from '$/schema/CoinInstance.ts'
import CoinPriceSchema from '$/schema/CoinPrice.ts'
import Eip8004ServiceSchema from '$/schema/Eip8004Service.ts'
import EnsNameSchema from '$/schema/EnsName.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import EvmCalldataSchema from '$/schema/EvmCalldata.ts'
import EvmContractSchema from '$/schema/EvmContract.ts'
import EvmContractSourceSchema from '$/schema/EvmContractSource.ts'
import EvmErrorSchema from '$/schema/EvmError.ts'
import EvmMempoolSchema from '$/schema/EvmMempool.ts'
import EvmSelectorSchema from '$/schema/EvmSelector.ts'
import EvmTopicSchema from '$/schema/EvmTopic.ts'
import EvmTransactionSchema from '$/schema/EvmTransaction.ts'
import FarcasterCastSchema from '$/schema/FarcasterCast.ts'
import FarcasterCastEmbedSchema from '$/schema/FarcasterCastEmbed.ts'
import FarcasterChannelSchema from '$/schema/FarcasterChannel.ts'
import FarcasterNetworkSchema from '$/schema/FarcasterNetwork.ts'
import FarcasterUserSchema from '$/schema/FarcasterUser.ts'
import LeverageSchema from '$/schema/Leverage.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import LiquidityPositionSchema from '$/schema/LiquidityPosition.ts'
import MediaSchema from '$/schema/Media.ts'
import MediaObjectSchema from '$/schema/MediaObject.ts'
import NetworkSchema from '$/schema/Network.ts'
import NetworkForkSchema from '$/schema/NetworkFork.ts'
import ProposalSchema from '$/schema/Proposal.ts'
import StateChannelSchema from '$/schema/StateChannel.ts'
import StateChannelDepositSchema from '$/schema/StateChannelDeposit.ts'
import StateChannelStateSchema from '$/schema/StateChannelState.ts'
import StateChannelTransferSchema from '$/schema/StateChannelTransfer.ts'
import SwapQuoteSchema from '$/schema/SwapQuote.ts'
import VaultSchema from '$/schema/Vault.ts'
import XmtpConversationSchema from '$/schema/XmtpConversation.ts'

export const schema = [
	_GlobalSchema,
	ActorSchema,
	ActorCoinSchema,
	ActorCoinAllowanceSchema,
	ActorNetworkSchema,
	BeaconActionSchema,
	BeaconEpochSchema,
	BeaconQueueSchema,
	BeaconSlotSchema,
	BeaconValidatorSchema,
	BlockheadAgentConversationSchema,
	BlockheadAgentConversationTurnSchema,
	BlockheadFarcasterAccountConnectionSchema,
	BlockheadPanelTreeSchema,
	BlockheadRoomSchema,
	BlockheadRoomPeerSchema,
	BlockheadSessionSchema,
	BlockheadSessionSimulationSchema,
	BlockheadSharedAddressSchema,
	BlockheadSiweChallengeSchema,
	BlockheadSocialPostSessionSchema,
	BlockheadSourceSchema,
	BlockheadTransferRequestSchema,
	BlockheadWalletSchema,
	BlockheadWalletConnectionSchema,
	BridgeRouteSchema,
	BridgeRouteStepSchema,
	BridgeTransactionSchema,
	CaipSchema,
	CctpAllowanceSchema,
	CctpFeeSchema,
	ChannelProposalSchema,
	CoinSchema,
	CoinInstanceSchema,
	CoinPriceSchema,
	Eip8004ServiceSchema,
	EnsNameSchema,
	EvmBlockSchema,
	EvmCalldataSchema,
	EvmContractSchema,
	EvmContractSourceSchema,
	EvmErrorSchema,
	EvmMempoolSchema,
	EvmSelectorSchema,
	EvmTopicSchema,
	EvmTransactionSchema,
	FarcasterCastSchema,
	FarcasterCastEmbedSchema,
	FarcasterChannelSchema,
	FarcasterNetworkSchema,
	FarcasterUserSchema,
	LeverageSchema,
	LiquidityPoolSchema,
	LiquidityPositionSchema,
	MediaSchema,
	MediaObjectSchema,
	NetworkSchema,
	NetworkForkSchema,
	ProposalSchema,
	StateChannelSchema,
	StateChannelDepositSchema,
	StateChannelStateSchema,
	StateChannelTransferSchema,
	SwapQuoteSchema,
	VaultSchema,
	XmtpConversationSchema,
] as const satisfies readonly EntityDefinitionTemplate[]

// export const schema = [
// 	(await import('$/schema/_Global.ts')).default,
// 	(await import('$/schema/Actor.ts')).default,
// 	(await import('$/schema/ActorCoin.ts')).default,
// 	(await import('$/schema/ActorCoinAllowance.ts')).default,
// 	(await import('$/schema/ActorNetwork.ts')).default,
// 	(await import('$/schema/BeaconAction.ts')).default,
// 	(await import('$/schema/BeaconEpoch.ts')).default,
// 	(await import('$/schema/BeaconQueue.ts')).default,
// 	(await import('$/schema/BeaconSlot.ts')).default,
// 	(await import('$/schema/BeaconValidator.ts')).default,
// 	(await import('$/schema/BlockheadAgentConversation.ts')).default,
// 	(await import('$/schema/BlockheadAgentConversationTurn.ts')).default,
// 	(await import('$/schema/BlockheadFarcasterAccountConnection.ts')).default,
// 	(await import('$/schema/BlockheadPanelTree.ts')).default,
// 	(await import('$/schema/BlockheadRoom.ts')).default,
// 	(await import('$/schema/BlockheadRoomPeer.ts')).default,
// 	(await import('$/schema/BlockheadSession.ts')).default,
// 	(await import('$/schema/BlockheadSessionSimulation.ts')).default,
// 	(await import('$/schema/BlockheadSharedAddress.ts')).default,
// 	(await import('$/schema/BlockheadSiweChallenge.ts')).default,
// 	(await import('$/schema/BlockheadSocialPostSession.ts')).default,
// 	(await import('$/schema/BlockheadSource.ts')).default,
// 	(await import('$/schema/BlockheadTransferRequest.ts')).default,
// 	(await import('$/schema/BlockheadWallet.ts')).default,
// 	(await import('$/schema/BlockheadWalletConnection.ts')).default,
// 	(await import('$/schema/BridgeRoute.ts')).default,
// 	(await import('$/schema/BridgeRouteStep.ts')).default,
// 	(await import('$/schema/BridgeTransaction.ts')).default,
// 	(await import('$/schema/Caip.ts')).default,
// 	(await import('$/schema/CctpAllowance.ts')).default,
// 	(await import('$/schema/CctpFee.ts')).default,
// 	(await import('$/schema/ChannelProposal.ts')).default,
// 	(await import('$/schema/Coin.ts')).default,
// 	(await import('$/schema/CoinInstance.ts')).default,
// 	(await import('$/schema/CoinPrice.ts')).default,
// 	(await import('$/schema/Eip8004Service.ts')).default,
// 	(await import('$/schema/EnsName.ts')).default,
// 	(await import('$/schema/EvmBlock.ts')).default,
// 	(await import('$/schema/EvmCalldata.ts')).default,
// 	(await import('$/schema/EvmContract.ts')).default,
// 	(await import('$/schema/EvmContractSource.ts')).default,
// 	(await import('$/schema/EvmError.ts')).default,
// 	(await import('$/schema/EvmMempool.ts')).default,
// 	(await import('$/schema/EvmSelector.ts')).default,
// 	(await import('$/schema/EvmTopic.ts')).default,
// 	(await import('$/schema/EvmTransaction.ts')).default,
// 	(await import('$/schema/FarcasterCast.ts')).default,
// 	(await import('$/schema/FarcasterCastEmbed.ts')).default,
// 	(await import('$/schema/FarcasterChannel.ts')).default,
// 	(await import('$/schema/FarcasterNetwork.ts')).default,
// 	(await import('$/schema/FarcasterUser.ts')).default,
// 	(await import('$/schema/Leverage.ts')).default,
// 	(await import('$/schema/LiquidityPool.ts')).default,
// 	(await import('$/schema/LiquidityPosition.ts')).default,
// 	(await import('$/schema/Media.ts')).default,
// 	(await import('$/schema/MediaObject.ts')).default,
// 	(await import('$/schema/Network.ts')).default,
// 	(await import('$/schema/NetworkFork.ts')).default,
// 	(await import('$/schema/Proposal.ts')).default,
// 	(await import('$/schema/StateChannel.ts')).default,
// 	(await import('$/schema/StateChannelDeposit.ts')).default,
// 	(await import('$/schema/StateChannelState.ts')).default,
// 	(await import('$/schema/StateChannelTransfer.ts')).default,
// 	(await import('$/schema/SwapQuote.ts')).default,
// 	(await import('$/schema/Vault.ts')).default,
// 	(await import('$/schema/XmtpConversation.ts')).default,
// ] as const satisfies readonly EntityDefinition[]

export type RegisteredEntityType = (typeof schema)[number]['entityType']

export type EntitySchemaFieldName<_EntityType extends RegisteredEntityType> = (
	Extract<(typeof schema)[number], { readonly entityType: _EntityType }>['fields'][number]['name']
)

export const entityDefinitionByType = Object.fromEntries(
	schema.map((definition) => [
		definition.entityType,
		definition,
	]),
)

export type Schema = readonly EntityDefinitionTemplate[]

export type EntityType<_Schema extends Schema> = _Schema[number]['entityType']

export type EntityDefinitionForEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Extract<_Schema[number], { entityType: _EntityType }>

export type EntityId<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['id']['infer']

export type EntityFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number]['name']

export type EntityFieldDefinition<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = Extract<EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number], { name: _FieldName }>

export type EntityFieldValue<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinition<_Schema, _EntityType, _FieldName> extends infer _FieldDefinition extends EntityFieldDefinitionTemplate ?
		EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	:
		never
)

export type EntityFieldValueFromDefinition<
	_Schema extends Schema,
	_EntityFieldDefinition extends _Schema[number]['fields'][number],
> = (
	_EntityFieldDefinition extends {
		type: EntityFieldType.Primitive
		primitiveType: infer _PrimitiveType extends Type<any, any>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: _PrimitiveType['infer'] | undefined
			[EntityFieldCardinality.One]: _PrimitiveType['infer']
			[EntityFieldCardinality.Many]: _PrimitiveType['infer'][]
			[EntityFieldCardinality.ZeroOrMany]: _PrimitiveType['infer'][] | undefined
		}[_EntityFieldDefinition['cardinality']]

	: _EntityFieldDefinition extends {
		type: EntityFieldType.EntityReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.ZeroOrOne]: Entity<_Schema, _RefEntityType> | undefined
			[EntityFieldCardinality.One]: Entity<_Schema, _RefEntityType>
		}[_EntityFieldDefinition['cardinality']]

	: _EntityFieldDefinition extends {
		type: EntityFieldType.EntitiesReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		{
			[EntityFieldCardinality.Zero]: undefined
			[EntityFieldCardinality.Many]: Entity<_Schema, _RefEntityType>[]
			[EntityFieldCardinality.ZeroOrMany]: Entity<_Schema, _RefEntityType>[] | undefined
		}[_EntityFieldDefinition['cardinality']]

	:
		never
)

export type EntityFieldValues<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = (
	& {
		[
			_FieldDefinition in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number] as (
				_FieldDefinition extends { cardinality: EntityFieldCardinality.One | EntityFieldCardinality.Many } ?
					_FieldDefinition['name']
				:
					never
			)
		]: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
	& {
		[
			_FieldDefinition in EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number] as (
				_FieldDefinition extends { cardinality: EntityFieldCardinality.Zero | EntityFieldCardinality.ZeroOrOne | EntityFieldCardinality.ZeroOrMany } ?
					_FieldDefinition['name']
				:
					never
			)
		]?: EntityFieldValueFromDefinition<_Schema, _FieldDefinition>
	}
)

export type Entity<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.Fields]?: Partial<EntityFieldValues<_Schema, _EntityType>>
}
