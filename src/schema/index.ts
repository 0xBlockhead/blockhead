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
import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
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
import NetworkConsensusUpgradeSchema from '$/schema/EthereumConsensusUpgrade.ts'
import CoinSchema from '$/schema/Coin.ts'
import CoinInstanceSchema from '$/schema/EvmCoinInstance.ts'
import Coin_EvmBlockSchema from '$/schema/Coin_EvmBlock.ts'
import Coin_TimestampSchema from '$/schema/Coin_Timestamp.ts'
import CosmosGovernanceProposalSchema from '$/schema/CosmosGovernanceProposal.ts'
import NetworkExecutionUpgradeSchema from '$/schema/EthereumExecutionUpgrade.ts'
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
import FarcasterVerifiedAddressSchema from '$/schema/FarcasterVerifiedAddress.ts'
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
import NetworkStackSchema from '$/schema/NetworkStack.ts'
import ExecutionEnvironmentSchema from '$/schema/ExecutionEnvironment.ts'
import ConsensusMechanismSchema from '$/schema/ConsensusMechanism.ts'
import AssetInstanceSchema from '$/schema/AssetInstance.ts'
import NetworkUpgradeSchema from '$/schema/NetworkUpgrade.ts'
import UtxoBlockSchema from '$/schema/UtxoBlock.ts'
import UtxoTransactionSchema from '$/schema/UtxoTransaction.ts'
import UtxoInputSchema from '$/schema/UtxoInput.ts'
import UtxoOutputSchema from '$/schema/UtxoOutput.ts'
import NearNetworkSchema from '$/schema/NearNetwork.ts'
import SolanaNetworkSchema from '$/schema/SolanaNetwork.ts'
import SolanaBlockSchema from '$/schema/SolanaBlock.ts'
import SolanaTransactionSchema from '$/schema/SolanaTransaction.ts'
import SolanaInstructionSchema from '$/schema/SolanaInstruction.ts'
import SolanaAccountSchema from '$/schema/SolanaAccount.ts'
import SolanaProgramSchema from '$/schema/SolanaProgram.ts'
import SolanaTokenMintSchema from '$/schema/SolanaTokenMint.ts'
import SolanaValidatorSchema from '$/schema/SolanaValidator.ts'
import CosmosBlockSchema from '$/schema/CosmosBlock.ts'
import CosmosTransactionSchema from '$/schema/CosmosTransaction.ts'
import CosmosMessageSchema from '$/schema/CosmosMessage.ts'
import CosmosAccountSchema from '$/schema/CosmosAccount.ts'
import CosmosValidatorSchema from '$/schema/CosmosValidator.ts'
import CosmosContractSchema from '$/schema/CosmosContract.ts'
import CosmosDenomSchema from '$/schema/CosmosDenom.ts'
import CosmosModuleSchema from '$/schema/CosmosModule.ts'
import FilecoinTipsetSchema from '$/schema/FilecoinTipset.ts'
import FilecoinBlockSchema from '$/schema/FilecoinBlock.ts'
import FilecoinMessageSchema from '$/schema/FilecoinMessage.ts'
import FilecoinActorSchema from '$/schema/FilecoinActor.ts'
import FilecoinMinerSchema from '$/schema/FilecoinMiner.ts'
import FilecoinSectorSchema from '$/schema/FilecoinSector.ts'
import PolkadotBlockSchema from '$/schema/PolkadotBlock.ts'
import PolkadotExtrinsicSchema from '$/schema/PolkadotExtrinsic.ts'
import PolkadotEventSchema from '$/schema/PolkadotEvent.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import PolkadotValidatorSchema from '$/schema/PolkadotValidator.ts'
import PolkadotPalletSchema from '$/schema/PolkadotPallet.ts'
import HyperliquidBlockSchema from '$/schema/HyperliquidBlock.ts'
import HyperliquidTransactionSchema from '$/schema/HyperliquidTransaction.ts'
import HyperliquidAccountSchema from '$/schema/HyperliquidAccount.ts'
import HyperliquidValidatorSchema from '$/schema/HyperliquidValidator.ts'
import HyperliquidSpotAssetSchema from '$/schema/HyperliquidSpotAsset.ts'
import HyperliquidPerpMarketSchema from '$/schema/HyperliquidPerpMarket.ts'
import NearBlockSchema from '$/schema/NearBlock.ts'
import NearChunkSchema from '$/schema/NearChunk.ts'
import NearTransactionSchema from '$/schema/NearTransaction.ts'
import NearReceiptSchema from '$/schema/NearReceipt.ts'
import NearActionSchema from '$/schema/NearAction.ts'
import NearExecutionOutcomeSchema from '$/schema/NearExecutionOutcome.ts'
import NearAccountSchema from '$/schema/NearAccount.ts'
import NearAccessKeySchema from '$/schema/NearAccessKey.ts'
import NearContractSchema from '$/schema/NearContract.ts'
import NearValidatorSchema from '$/schema/NearValidator.ts'
import MoneroBlockSchema from '$/schema/MoneroBlock.ts'
import MoneroTransactionSchema from '$/schema/MoneroTransaction.ts'
import MoneroStealthOutputSchema from '$/schema/MoneroStealthOutput.ts'
import MoneroKeyImageSchema from '$/schema/MoneroKeyImage.ts'
import MoneroRingSchema from '$/schema/MoneroRing.ts'
import MoneroRingMemberSchema from '$/schema/MoneroRingMember.ts'
import LitecoinMwebBlockSchema from '$/schema/LitecoinMwebBlock.ts'
import LitecoinMwebTransactionSchema from '$/schema/LitecoinMwebTransaction.ts'
import LitecoinMwebPegInSchema from '$/schema/LitecoinMwebPegIn.ts'
import LitecoinMwebPegOutSchema from '$/schema/LitecoinMwebPegOut.ts'
import LitecoinMwebOutputSchema from '$/schema/LitecoinMwebOutput.ts'
import LightningNetworkSchema from '$/schema/LightningNetwork.ts'
import LightningNetwork_TimestampSchema from '$/schema/LightningNetwork_Timestamp.ts'
import LightningNodeSchema from '$/schema/LightningNode.ts'
import LightningChannelSchema from '$/schema/LightningChannel.ts'
import LightningInvoiceSchema from '$/schema/LightningInvoice.ts'
import LightningPaymentSchema from '$/schema/LightningPayment.ts'
import LightningHtlcSchema from '$/schema/LightningHtlc.ts'
import DogecoinBlockAuxPowSchema from '$/schema/DogecoinBlockAuxPow.ts'
import DogecoinAuxPowParentBlockHeaderSchema from '$/schema/DogecoinAuxPowParentBlockHeader.ts'
import DogecoinAuxPowMerkleBranchSchema from '$/schema/DogecoinAuxPowMerkleBranch.ts'
import BitcoinCashCashTokenCategorySchema from '$/schema/BitcoinCashCashTokenCategory.ts'
import BitcoinCashCashTokenFungibleAmountSchema from '$/schema/BitcoinCashCashTokenFungibleAmount.ts'
import BitcoinCashCashTokenNftSchema from '$/schema/BitcoinCashCashTokenNft.ts'
import BitcoinCashCashTokenCommitmentSchema from '$/schema/BitcoinCashCashTokenCommitment.ts'
import BitcoinCashBcmrMetadataSchema from '$/schema/BitcoinCashBcmrMetadata.ts'
import TronAccountSchema from '$/schema/TronAccount.ts'
import TronBlockSchema from '$/schema/TronBlock.ts'
import TronContractSchema from '$/schema/TronContract.ts'
import TronTokenSchema from '$/schema/TronToken.ts'
import TronTokenTransferSchema from '$/schema/TronTokenTransfer.ts'
import TronTransactionSchema from '$/schema/TronTransaction.ts'
import ZeroGConsensusNetworkSchema from '$/schema/ZeroGConsensusNetwork.ts'
import ZeroGDaNodeSchema from '$/schema/ZeroGDaNode.ts'
import ZeroGDaQuorumSchema from '$/schema/ZeroGDaQuorum.ts'
import ZeroGDataBlobSchema from '$/schema/ZeroGDataBlob.ts'
import ZeroGDataChunkSchema from '$/schema/ZeroGDataChunk.ts'
import ZeroGKvEntrySchema from '$/schema/ZeroGKvEntry.ts'
import ZeroGServiceProviderSchema from '$/schema/ZeroGServiceProvider.ts'
import ZeroGServiceRequestSchema from '$/schema/ZeroGServiceRequest.ts'
import ZeroGSettlementTraceSchema from '$/schema/ZeroGSettlementTrace.ts'
import ZeroGStorageLogEntrySchema from '$/schema/ZeroGStorageLogEntry.ts'
import ZeroGStorageNodeSchema from '$/schema/ZeroGStorageNode.ts'
import ZeroGStorageProofSchema from '$/schema/ZeroGStorageProof.ts'
import QuilibriumFrameSchema from '$/schema/QuilibriumFrame.ts'
import QuilibriumShardSchema from '$/schema/QuilibriumShard.ts'
import QuilibriumProverSchema from '$/schema/QuilibriumProver.ts'
import QuilibriumAccountSchema from '$/schema/QuilibriumAccount.ts'
import QuilibriumPendingTransactionSchema from '$/schema/QuilibriumPendingTransaction.ts'
import ZcashShieldedPoolSchema from '$/schema/ZcashShieldedPool.ts'
import ZcashShieldedActionSchema from '$/schema/ZcashShieldedAction.ts'
import LogosZoneSchema from '$/schema/LogosZone.ts'
import LogosAccountSchema from '$/schema/LogosAccount.ts'
import LogosTransactionSchema from '$/schema/LogosTransaction.ts'
import EvmNetworkSchema from '$/schema/EvmNetwork.ts'
import EvmNetworkBridgeSchema from '$/schema/EvmNetworkBridge.ts'
import EthereumBeaconFinality_TimestampSchema from '$/schema/EthereumBeaconFinality_Timestamp.ts'
import EvmNetwork_GasFee_BlockSchema from '$/schema/EvmNetwork_GasFee_Block.ts'
import EvmNetwork_GasEstimate_TimestampSchema from '$/schema/EvmNetwork_GasEstimate_Timestamp.ts'
import EvmNetwork_Txpool_TimestampSchema from '$/schema/EvmNetwork_Txpool_Timestamp.ts'
import NostrArticleSchema from '$/schema/NostrArticle.ts'
import NostrNetworkSchema from '$/schema/NostrNetwork.ts'
import NostrNoteSchema from '$/schema/NostrNote.ts'
import NostrProfileSchema from '$/schema/NostrProfile.ts'
import NostrReactionSchema from '$/schema/NostrReaction.ts'
import NostrRelaySchema from '$/schema/NostrRelay.ts'
import NostrRepostSchema from '$/schema/NostrRepost.ts'
import PolkadotReferendumSchema from '$/schema/PolkadotReferendum.ts'
import ProposalKindSchema from '$/schema/SpecificationProposalKind.ts'
import SpecificationRealmSchema from '$/schema/SpecificationRealm.ts'
import ProposalSchema from '$/schema/SpecificationProposal.ts'
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
import EthereumNetworkUpgradeSchema from '$/schema/EthereumNetworkUpgrade.ts'

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
	BeaconEpochSchema,
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
	NetworkConsensusUpgradeSchema,
	CoinSchema,
	CoinInstanceSchema,
	Coin_EvmBlockSchema,
	Coin_TimestampSchema,
	CosmosGovernanceProposalSchema,
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
	FarcasterVerifiedAddressSchema,
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
	NetworkStackSchema,
	ExecutionEnvironmentSchema,
	ConsensusMechanismSchema,
	AssetInstanceSchema,
	NetworkUpgradeSchema,
	UtxoBlockSchema,
	UtxoTransactionSchema,
	UtxoInputSchema,
	UtxoOutputSchema,
	NearNetworkSchema,
	SolanaNetworkSchema,
	SolanaBlockSchema,
	SolanaTransactionSchema,
	SolanaInstructionSchema,
	SolanaAccountSchema,
	SolanaProgramSchema,
	SolanaTokenMintSchema,
	SolanaValidatorSchema,
	CosmosBlockSchema,
	CosmosTransactionSchema,
	CosmosMessageSchema,
	CosmosAccountSchema,
	CosmosValidatorSchema,
	CosmosContractSchema,
	CosmosDenomSchema,
	CosmosModuleSchema,
	FilecoinTipsetSchema,
	FilecoinBlockSchema,
	FilecoinMessageSchema,
	FilecoinActorSchema,
	FilecoinMinerSchema,
	FilecoinSectorSchema,
	PolkadotBlockSchema,
	PolkadotExtrinsicSchema,
	PolkadotEventSchema,
	PolkadotAccountSchema,
	PolkadotValidatorSchema,
	PolkadotPalletSchema,
	HyperliquidBlockSchema,
	HyperliquidTransactionSchema,
	HyperliquidAccountSchema,
	HyperliquidValidatorSchema,
	HyperliquidSpotAssetSchema,
	HyperliquidPerpMarketSchema,
	NearBlockSchema,
	NearChunkSchema,
	NearTransactionSchema,
	NearReceiptSchema,
	NearActionSchema,
	NearExecutionOutcomeSchema,
	NearAccountSchema,
	NearAccessKeySchema,
	NearContractSchema,
	NearValidatorSchema,
	MoneroBlockSchema,
	MoneroTransactionSchema,
	MoneroStealthOutputSchema,
	MoneroKeyImageSchema,
	MoneroRingSchema,
	MoneroRingMemberSchema,
	LitecoinMwebBlockSchema,
	LitecoinMwebTransactionSchema,
	LitecoinMwebPegInSchema,
	LitecoinMwebPegOutSchema,
	LitecoinMwebOutputSchema,
	LightningNetworkSchema,
	LightningNetwork_TimestampSchema,
	LightningNodeSchema,
	LightningChannelSchema,
	LightningInvoiceSchema,
	LightningPaymentSchema,
	LightningHtlcSchema,
	DogecoinBlockAuxPowSchema,
	DogecoinAuxPowParentBlockHeaderSchema,
	DogecoinAuxPowMerkleBranchSchema,
	BitcoinCashCashTokenCategorySchema,
	BitcoinCashCashTokenFungibleAmountSchema,
	BitcoinCashCashTokenNftSchema,
	BitcoinCashCashTokenCommitmentSchema,
	BitcoinCashBcmrMetadataSchema,
	TronAccountSchema,
	TronBlockSchema,
	TronContractSchema,
	TronTokenSchema,
	TronTokenTransferSchema,
	TronTransactionSchema,
	ZeroGConsensusNetworkSchema,
	ZeroGDaNodeSchema,
	ZeroGDaQuorumSchema,
	ZeroGDataBlobSchema,
	ZeroGDataChunkSchema,
	ZeroGKvEntrySchema,
	ZeroGServiceProviderSchema,
	ZeroGServiceRequestSchema,
	ZeroGSettlementTraceSchema,
	ZeroGStorageLogEntrySchema,
	ZeroGStorageNodeSchema,
	ZeroGStorageProofSchema,
	QuilibriumFrameSchema,
	QuilibriumShardSchema,
	QuilibriumProverSchema,
	QuilibriumAccountSchema,
	QuilibriumPendingTransactionSchema,
	ZcashShieldedPoolSchema,
	ZcashShieldedActionSchema,
	LogosZoneSchema,
	LogosAccountSchema,
	LogosTransactionSchema,
	EvmNetworkSchema,
	EvmNetworkBridgeSchema,
	EthereumBeaconFinality_TimestampSchema,
	EvmNetwork_GasFee_BlockSchema,
	EvmNetwork_GasEstimate_TimestampSchema,
	EvmNetwork_Txpool_TimestampSchema,
	NostrArticleSchema,
	NostrNetworkSchema,
	NostrNoteSchema,
	NostrProfileSchema,
	NostrReactionSchema,
	NostrRelaySchema,
	NostrRepostSchema,
	PolkadotReferendumSchema,
	ProposalKindSchema,
	SpecificationRealmSchema,
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
	EthereumNetworkUpgradeSchema,
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
