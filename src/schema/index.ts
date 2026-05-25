import type { Schema } from '$/schema/$schema.ts'

import _GlobalSchema from '$/schema/_Global.ts'
import ActivityPubActorSchema from '$/schema/ActivityPubActor.ts'
import ActivityPubNetworkSchema from '$/schema/ActivityPubNetwork.ts'
import ActivityPubNoteSchema from '$/schema/ActivityPubNote.ts'
import ActorSchema from '$/schema/Actor.ts'
import Actor_Coin_EvmBlockSchema from '$/schema/Actor_Coin_EvmBlock.ts'
import AtprotoActorSchema from '$/schema/AtprotoActor.ts'
import AtprotoPostSchema from '$/schema/AtprotoPost.ts'
import AtprotoNetworkSchema from '$/schema/AtprotoNetwork.ts'
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
import CoinBridgeCapabilitySchema from '$/schema/CoinBridgeCapability.ts'
import BridgeTransactionSchema from '$/schema/BridgeTransaction.ts'
import CctpAllowanceSchema from '$/schema/CctpAllowance.ts'
import CctpFeeSchema from '$/schema/CctpFee.ts'
import ChannelProposalSchema from '$/schema/ChannelProposal.ts'
import NetworkConsensusUpgradeSchema from '$/schema/ConsensusUpgrade.ts'
import CoinSchema from '$/schema/Coin.ts'
import CoinInstanceSchema from '$/schema/CoinInstance.ts'
import Coin_EvmBlockSchema from '$/schema/Coin_EvmBlock.ts'
import Coin_TimestampSchema from '$/schema/Coin_Timestamp.ts'
import NetworkExecutionUpgradeSchema from '$/schema/ExecutionUpgrade.ts'
import MarketSchema from '$/schema/Market.ts'
import MarketVenueSchema from '$/schema/MarketVenue.ts'
import MarketPriceSchema from '$/schema/MarketPrice.ts'
import Market_TimeInterval_TimestampSchema from '$/schema/Market_TimeInterval_Timestamp.ts'
import Market_TimestampSchema from '$/schema/Market_Timestamp.ts'
import MevRelay_ProposerPayloadDeliveredSchema from '$/schema/MevRelay_ProposerPayloadDelivered.ts'
import Eip8004ServiceSchema from '$/schema/Eip8004Service.ts'
import EnsNameSchema from '$/schema/EnsName.ts'
import EnsProtocolSchema from '$/schema/EnsProtocol.ts'
import EnsSearchSchema from '$/schema/EnsSearch.ts'
import Erc4337AccountFactorySchema from '$/schema/Erc4337AccountFactory.ts'
import Erc4337BundlerSchema from '$/schema/Erc4337Bundler.ts'
import Erc4337PaymasterSchema from '$/schema/Erc4337Paymaster.ts'
import Erc4337SmartAccountSchema from '$/schema/Erc4337SmartAccount.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import EvmBlobSchema from '$/schema/EvmBlob.ts'
import EvmCalldataSchema from '$/schema/EvmCalldata.ts'
import EvmContractSchema from '$/schema/EvmContract.ts'
import EvmContractCompilationSchema from '$/schema/EvmContractCompilation.ts'
import EvmContractSourceBundleSchema from '$/schema/EvmContractSourceBundle.ts'
import EvmContractVerificationSchema from '$/schema/EvmContractVerification.ts'
import EvmErrorSchema from '$/schema/EvmError.ts'
import EvmProtocolSchema from '$/schema/EvmProtocol.ts'
import EvmInternalTransferSchema from '$/schema/EvmInternalTransfer.ts'
import EvmLogSchema from '$/schema/EvmLog.ts'
import EvmMempoolSchema from '$/schema/EvmMempool.ts'
import EvmSelectorSchema from '$/schema/EvmSelector.ts'
import EvmTopicSchema from '$/schema/EvmTopic.ts'
import EvmTokenTransferSchema from '$/schema/EvmTokenTransfer.ts'
import EvmTransactionSchema from '$/schema/EvmTransaction.ts'
import EvmUserOperationSchema from '$/schema/EvmUserOperation.ts'
import FarcasterCastSchema from '$/schema/FarcasterCast.ts'
import FarcasterCastEmbedSchema from '$/schema/FarcasterCastEmbed.ts'
import FarcasterChannelSchema from '$/schema/FarcasterChannel.ts'
import FarcasterFeedSchema from '$/schema/FarcasterFeed.ts'
import FarcasterNetworkSchema from '$/schema/FarcasterNetwork.ts'
import FarcasterUserSchema from '$/schema/FarcasterUser.ts'
import CurrencySchema from '$/schema/Currency.ts'
import Currency_TimestampSchema from '$/schema/Currency_Timestamp.ts'
import IpfsProtocolSchema from '$/schema/IpfsProtocol.ts'
import IpfsResourceSchema from '$/schema/IpfsResource.ts'
import LensAccountSchema from '$/schema/LensAccount.ts'
import LensPostSchema from '$/schema/LensPost.ts'
import LensNetworkSchema from '$/schema/LensNetwork.ts'
import LeverageSchema from '$/schema/Leverage.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import LiquidityPositionSchema from '$/schema/LiquidityPosition.ts'
import MediaSchema from '$/schema/Media.ts'
import MediaObjectSchema from '$/schema/MediaObject.ts'
import NetworkSchema from '$/schema/Network.ts'
import NetworkBridgeSchema from '$/schema/NetworkBridge.ts'
import Network_GasFee_BlockSchema from '$/schema/Network_GasFee_Block.ts'
import Network_GasEstimate_TimestampSchema from '$/schema/Network_GasEstimate_Timestamp.ts'
import Network_Txpool_TimestampSchema from '$/schema/Network_Txpool_Timestamp.ts'
import NostrArticleSchema from '$/schema/NostrArticle.ts'
import NostrNetworkSchema from '$/schema/NostrNetwork.ts'
import NostrNoteSchema from '$/schema/NostrNote.ts'
import NostrProfileSchema from '$/schema/NostrProfile.ts'
import NostrReactionSchema from '$/schema/NostrReaction.ts'
import NostrRelaySchema from '$/schema/NostrRelay.ts'
import NostrRepostSchema from '$/schema/NostrRepost.ts'
import ProposalKindSchema from '$/schema/ProposalKind.ts'
import ProposalRealmSchema from '$/schema/ProposalRealm.ts'
import ProposalSchema from '$/schema/Proposal.ts'
import RedditCommentSchema from '$/schema/RedditComment.ts'
import RedditLinkSchema from '$/schema/RedditLink.ts'
import RedditSubredditSchema from '$/schema/RedditSubreddit.ts'
import RedditNetworkSchema from '$/schema/RedditNetwork.ts'
import RssFeedSchema from '$/schema/RssFeed.ts'
import RssItemSchema from '$/schema/RssItem.ts'
import RssNetworkSchema from '$/schema/RssNetwork.ts'
import StateChannelSchema from '$/schema/StateChannel.ts'
import StateChannelDepositSchema from '$/schema/StateChannelDeposit.ts'
import StateChannelStateSchema from '$/schema/StateChannelState.ts'
import StateChannelTransferSchema from '$/schema/StateChannelTransfer.ts'
import SwarmProtocolSchema from '$/schema/SwarmProtocol.ts'
import SwarmResourceSchema from '$/schema/SwarmResource.ts'
import SwapQuoteSchema from '$/schema/SwapQuote.ts'
import UrlSchema from '$/schema/Url.ts'
import VaultSchema from '$/schema/Vault.ts'
import XPostSchema from '$/schema/XPost.ts'
import XUserSchema from '$/schema/XUser.ts'
import XNetworkSchema from '$/schema/XNetwork.ts'
import XmtpConversationSchema from '$/schema/XmtpConversation.ts'
import XmtpNetworkSchema from '$/schema/XmtpNetwork.ts'
import YouTubeChannelSchema from '$/schema/YouTubeChannel.ts'
import YouTubeCommentSchema from '$/schema/YouTubeComment.ts'
import YouTubeNetworkSchema from '$/schema/YouTubeNetwork.ts'
import YouTubePlaylistSchema from '$/schema/YouTubePlaylist.ts'
import YouTubeVideoSchema from '$/schema/YouTubeVideo.ts'
import NetworkUpgradeSchema from '$/schema/Upgrade.ts'

export const schema = [
	_GlobalSchema,
	ActivityPubActorSchema,
	ActivityPubNetworkSchema,
	ActivityPubNoteSchema,
	ActorSchema,
	Actor_Coin_EvmBlockSchema,
	AtprotoActorSchema,
	AtprotoPostSchema,
	AtprotoNetworkSchema,
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
	CoinBridgeCapabilitySchema,
	BridgeTransactionSchema,
	CctpAllowanceSchema,
	CctpFeeSchema,
	ChannelProposalSchema,
	NetworkConsensusUpgradeSchema,
	CoinSchema,
	CoinInstanceSchema,
	Coin_EvmBlockSchema,
	Coin_TimestampSchema,
	NetworkExecutionUpgradeSchema,
	MarketSchema,
	MarketVenueSchema,
	MarketPriceSchema,
	Market_TimeInterval_TimestampSchema,
	Market_TimestampSchema,
	MevRelay_ProposerPayloadDeliveredSchema,
	Eip8004ServiceSchema,
	EnsNameSchema,
	EnsProtocolSchema,
	EnsSearchSchema,
	Erc4337AccountFactorySchema,
	Erc4337BundlerSchema,
	Erc4337PaymasterSchema,
	Erc4337SmartAccountSchema,
	EvmBlockSchema,
	EvmBlobSchema,
	EvmCalldataSchema,
	EvmContractSchema,
	EvmContractCompilationSchema,
	EvmContractSourceBundleSchema,
	EvmContractVerificationSchema,
	EvmErrorSchema,
	EvmProtocolSchema,
	EvmInternalTransferSchema,
	EvmLogSchema,
	EvmMempoolSchema,
	EvmSelectorSchema,
	EvmTopicSchema,
	EvmTokenTransferSchema,
	EvmTransactionSchema,
	EvmUserOperationSchema,
	FarcasterCastSchema,
	FarcasterCastEmbedSchema,
	FarcasterChannelSchema,
	FarcasterFeedSchema,
	FarcasterNetworkSchema,
	FarcasterUserSchema,
	CurrencySchema,
	Currency_TimestampSchema,
	IpfsProtocolSchema,
	IpfsResourceSchema,
	LensAccountSchema,
	LensPostSchema,
	LensNetworkSchema,
	LeverageSchema,
	LiquidityPoolSchema,
	LiquidityPositionSchema,
	MediaSchema,
	MediaObjectSchema,
	NetworkSchema,
	NetworkBridgeSchema,
	Network_GasFee_BlockSchema,
	Network_GasEstimate_TimestampSchema,
	Network_Txpool_TimestampSchema,
	NostrArticleSchema,
	NostrNetworkSchema,
	NostrNoteSchema,
	NostrProfileSchema,
	NostrReactionSchema,
	NostrRelaySchema,
	NostrRepostSchema,
	ProposalKindSchema,
	ProposalRealmSchema,
	ProposalSchema,
	RedditCommentSchema,
	RedditLinkSchema,
	RedditSubredditSchema,
	RedditNetworkSchema,
	RssFeedSchema,
	RssItemSchema,
	RssNetworkSchema,
	StateChannelSchema,
	StateChannelDepositSchema,
	StateChannelStateSchema,
	StateChannelTransferSchema,
	SwarmProtocolSchema,
	SwarmResourceSchema,
	SwapQuoteSchema,
	UrlSchema,
	NetworkUpgradeSchema,
	VaultSchema,
	XPostSchema,
	XUserSchema,
	XNetworkSchema,
	XmtpConversationSchema,
	XmtpNetworkSchema,
	YouTubeChannelSchema,
	YouTubeCommentSchema,
	YouTubeNetworkSchema,
	YouTubePlaylistSchema,
	YouTubeVideoSchema,
] as const satisfies Schema

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
