import type { EntityDefinition, EntityFromDefinition, EntityIdFromDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export const schema = [
	(await import('$/schema/_Global.ts')).default,
	(await import('$/schema/Actor.ts')).default,
	(await import('$/schema/ActorCoin.ts')).default,
	(await import('$/schema/ActorCoinAllowance.ts')).default,
	(await import('$/schema/ActorNetwork.ts')).default,
	(await import('$/schema/BeaconAction.ts')).default,
	(await import('$/schema/BeaconEpoch.ts')).default,
	(await import('$/schema/BeaconQueue.ts')).default,
	(await import('$/schema/BeaconSlot.ts')).default,
	(await import('$/schema/BeaconValidator.ts')).default,
	(await import('$/schema/BlockheadAgentConversation.ts')).default,
	(await import('$/schema/BlockheadAgentConversationTurn.ts')).default,
	(await import('$/schema/BlockheadEntityCollection.ts')).default,
	(await import('$/schema/BlockheadFarcasterAccountConnection.ts')).default,
	(await import('$/schema/BlockheadPanelTree.ts')).default,
	(await import('$/schema/BlockheadRoom.ts')).default,
	(await import('$/schema/BlockheadRoomPeer.ts')).default,
	(await import('$/schema/BlockheadSession.ts')).default,
	(await import('$/schema/BlockheadSessionSimulation.ts')).default,
	(await import('$/schema/BlockheadSharedAddress.ts')).default,
	(await import('$/schema/BlockheadSiweChallenge.ts')).default,
	(await import('$/schema/BlockheadSocialPostSession.ts')).default,
	(await import('$/schema/BlockheadSource.ts')).default,
	(await import('$/schema/BlockheadTransferRequest.ts')).default,
	(await import('$/schema/BlockheadWallet.ts')).default,
	(await import('$/schema/BlockheadWalletConnection.ts')).default,
	(await import('$/schema/BridgeRoute.ts')).default,
	(await import('$/schema/BridgeRouteStep.ts')).default,
	(await import('$/schema/BridgeTransaction.ts')).default,
	(await import('$/schema/Caip.ts')).default,
	(await import('$/schema/CctpAllowance.ts')).default,
	(await import('$/schema/CctpFee.ts')).default,
	(await import('$/schema/ChannelProposal.ts')).default,
	(await import('$/schema/Coin.ts')).default,
	(await import('$/schema/CoinInstance.ts')).default,
	(await import('$/schema/CoinPrice.ts')).default,
	(await import('$/schema/Eip8004Service.ts')).default,
	(await import('$/schema/EnsName.ts')).default,
	(await import('$/schema/EvmBlock.ts')).default,
	(await import('$/schema/EvmCalldata.ts')).default,
	(await import('$/schema/EvmContract.ts')).default,
	(await import('$/schema/EvmContractSource.ts')).default,
	(await import('$/schema/EvmError.ts')).default,
	(await import('$/schema/EvmMempool.ts')).default,
	(await import('$/schema/EvmSelector.ts')).default,
	(await import('$/schema/EvmTopic.ts')).default,
	(await import('$/schema/EvmTransaction.ts')).default,
	(await import('$/schema/FarcasterCast.ts')).default,
	(await import('$/schema/FarcasterCastEmbed.ts')).default,
	(await import('$/schema/FarcasterChannel.ts')).default,
	(await import('$/schema/FarcasterNetwork.ts')).default,
	(await import('$/schema/FarcasterUser.ts')).default,
	(await import('$/schema/Leverage.ts')).default,
	(await import('$/schema/LiquidityPool.ts')).default,
	(await import('$/schema/LiquidityPosition.ts')).default,
	(await import('$/schema/Media.ts')).default,
	(await import('$/schema/MediaObject.ts')).default,
	(await import('$/schema/Network.ts')).default,
	(await import('$/schema/NetworkFork.ts')).default,
	(await import('$/schema/Proposal.ts')).default,
	(await import('$/schema/StateChannel.ts')).default,
	(await import('$/schema/StateChannelDeposit.ts')).default,
	(await import('$/schema/StateChannelState.ts')).default,
	(await import('$/schema/StateChannelTransfer.ts')).default,
	(await import('$/schema/SwapQuote.ts')).default,
	(await import('$/schema/Vault.ts')).default,
	(await import('$/schema/XmtpConversation.ts')).default,
] as const satisfies readonly EntityDefinition[]

export const entityDefinitionByType = (
	Object.fromEntries(
		schema
			.map((definition) => [
				definition.entityType,
				definition,
			])
	)
)

export type Entity<_EntityType extends EntityType = EntityType> = (
	_EntityType extends keyof typeof entityDefinitionByType ?
		EntityFromDefinition<typeof entityDefinitionByType[_EntityType]>
	:
		{ $id: unknown }
)

export type EntityId<_EntityType extends EntityType = EntityType> = (
	_EntityType extends keyof typeof entityDefinitionByType ?
		EntityIdFromDefinition<typeof entityDefinitionByType[_EntityType]>
	:
		unknown
)
