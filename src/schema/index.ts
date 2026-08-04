// Generated from APP.ts.

import _GlobalSchema from '$/schema/_Global.ts'
import _GlobalActivityPubNetwork_TimestampSchema from '$/schema/_GlobalActivityPubNetwork_Timestamp.ts'
import _GlobalActivityPubNetworkSchema from '$/schema/_GlobalActivityPubNetwork.ts'
import _GlobalAgentNetwork_TimestampSchema from '$/schema/_GlobalAgentNetwork_Timestamp.ts'
import _GlobalAgentNetworkSchema from '$/schema/_GlobalAgentNetwork.ts'
import _GlobalAiArtifactCatalog_TimestampSchema from '$/schema/_GlobalAiArtifactCatalog_Timestamp.ts'
import _GlobalAiArtifactCatalogSchema from '$/schema/_GlobalAiArtifactCatalog.ts'
import _GlobalAiModelCatalog_TimestampSchema from '$/schema/_GlobalAiModelCatalog_Timestamp.ts'
import _GlobalAiModelCatalogSchema from '$/schema/_GlobalAiModelCatalog.ts'
import _GlobalArweaveNetworkSchema from '$/schema/_GlobalArweaveNetwork.ts'
import _GlobalAtprotoNetwork_TimestampSchema from '$/schema/_GlobalAtprotoNetwork_Timestamp.ts'
import _GlobalAtprotoNetworkSchema from '$/schema/_GlobalAtprotoNetwork.ts'
import _GlobalEnsNetwork_TimestampSchema from '$/schema/_GlobalEnsNetwork_Timestamp.ts'
import _GlobalEnsNetworkSchema from '$/schema/_GlobalEnsNetwork.ts'
import _GlobalEvmAbiCatalog_TimestampSchema from '$/schema/_GlobalEvmAbiCatalog_Timestamp.ts'
import _GlobalEvmAbiCatalogSchema from '$/schema/_GlobalEvmAbiCatalog.ts'
import _GlobalIpfsAccessSchema from '$/schema/_GlobalIpfsAccess.ts'
import _GlobalNostrNetwork_TimestampSchema from '$/schema/_GlobalNostrNetwork_Timestamp.ts'
import _GlobalNostrNetworkSchema from '$/schema/_GlobalNostrNetwork.ts'
import _GlobalRedditNetwork_TimestampSchema from '$/schema/_GlobalRedditNetwork_Timestamp.ts'
import _GlobalRedditNetworkSchema from '$/schema/_GlobalRedditNetwork.ts'
import _GlobalSwarmAccess_TimestampSchema from '$/schema/_GlobalSwarmAccess_Timestamp.ts'
import _GlobalSwarmAccessSchema from '$/schema/_GlobalSwarmAccess.ts'
import _GlobalXNetworkSchema from '$/schema/_GlobalXNetwork.ts'
import _GlobalYoutubeNetwork_TimestampSchema from '$/schema/_GlobalYoutubeNetwork_Timestamp.ts'
import _GlobalYoutubeNetworkSchema from '$/schema/_GlobalYoutubeNetwork.ts'
import { indexSchema, type EntityFieldDefinitions, type EntitySelector, type Schema } from '$/schema/$schema.ts'
import A2aAgentCard_SnapshotSchema from '$/schema/A2aAgentCard_Snapshot.ts'
import A2aAgentCardSchema from '$/schema/A2aAgentCard.ts'
import A2aAgentInterfaceSchema from '$/schema/A2aAgentInterface.ts'
import A2aAgentService_TimestampSchema from '$/schema/A2aAgentService_Timestamp.ts'
import A2aAgentServiceSchema from '$/schema/A2aAgentService.ts'
import A2aAgentSkillSchema from '$/schema/A2aAgentSkill.ts'
import A2aArtifactSchema from '$/schema/A2aArtifact.ts'
import A2aMessageSchema from '$/schema/A2aMessage.ts'
import A2aMessagePartSchema from '$/schema/A2aMessagePart.ts'
import A2aPushNotificationConfigSchema from '$/schema/A2aPushNotificationConfig.ts'
import A2aTask_TimestampSchema from '$/schema/A2aTask_Timestamp.ts'
import A2aTaskSchema from '$/schema/A2aTask.ts'
import A2aTaskEventSchema from '$/schema/A2aTaskEvent.ts'
import AccountSchema from '$/schema/Account.ts'
import AcpAgentProgramSchema from '$/schema/AcpAgentProgram.ts'
import AcpAgentProgramVersionSchema from '$/schema/AcpAgentProgramVersion.ts'
import AcpAgentRuntime_TimestampSchema from '$/schema/AcpAgentRuntime_Timestamp.ts'
import AcpAgentRuntimeSchema from '$/schema/AcpAgentRuntime.ts'
import AcpFileOperationSchema from '$/schema/AcpFileOperation.ts'
import AcpMessageSchema from '$/schema/AcpMessage.ts'
import AcpMessagePartSchema from '$/schema/AcpMessagePart.ts'
import AcpPermissionRequestSchema from '$/schema/AcpPermissionRequest.ts'
import AcpPromptTurnSchema from '$/schema/AcpPromptTurn.ts'
import AcpSessionSchema from '$/schema/AcpSession.ts'
import AcpSessionUpdateSchema from '$/schema/AcpSessionUpdate.ts'
import AcpTerminal_TimestampSchema from '$/schema/AcpTerminal_Timestamp.ts'
import AcpTerminalSchema from '$/schema/AcpTerminal.ts'
import AcpToolCall_TimestampSchema from '$/schema/AcpToolCall_Timestamp.ts'
import AcpToolCallSchema from '$/schema/AcpToolCall.ts'
import ActivityPubActor_TimestampSchema from '$/schema/ActivityPubActor_Timestamp.ts'
import ActivityPubActorSchema from '$/schema/ActivityPubActor.ts'
import ActivityPubInstance_TimestampSchema from '$/schema/ActivityPubInstance_Timestamp.ts'
import ActivityPubInstanceSchema from '$/schema/ActivityPubInstance.ts'
import ActivityPubInstanceModeratedDomainSchema from '$/schema/ActivityPubInstanceModeratedDomain.ts'
import ActivityPubInstancePeerSchema from '$/schema/ActivityPubInstancePeer.ts'
import ActivityPubNetworkSchema from '$/schema/ActivityPubNetwork.ts'
import ActivityPubNote_TimestampSchema from '$/schema/ActivityPubNote_Timestamp.ts'
import ActivityPubNoteSchema from '$/schema/ActivityPubNote.ts'
import AgentIdentityClaimSchema from '$/schema/AgentIdentityClaim.ts'
import AgentPaymentRequirement_TimestampSchema from '$/schema/AgentPaymentRequirement_Timestamp.ts'
import AiArtifactSchema from '$/schema/AiArtifact.ts'
import AiArtifactAttestationSchema from '$/schema/AiArtifactAttestation.ts'
import AiBenchmarkSchema from '$/schema/AiBenchmark.ts'
import AiDatasetSchema from '$/schema/AiDataset.ts'
import AiDocumentSchema from '$/schema/AiDocument.ts'
import AiDocumentClaimSchema from '$/schema/AiDocumentClaim.ts'
import AiEvaluation_TimestampSchema from '$/schema/AiEvaluation_Timestamp.ts'
import AiModel_TimestampSchema from '$/schema/AiModel_Timestamp.ts'
import AiModelSchema from '$/schema/AiModel.ts'
import AiModelProviderSchema from '$/schema/AiModelProvider.ts'
import AiModelVersionSchema from '$/schema/AiModelVersion.ts'
import AiProviderApiOperation_TimestampSchema from '$/schema/AiProviderApiOperation_Timestamp.ts'
import AiProviderApiOperationSchema from '$/schema/AiProviderApiOperation.ts'
import AiProviderCatalogEntry_TimestampSchema from '$/schema/AiProviderCatalogEntry_Timestamp.ts'
import AiProviderCatalogEntrySchema from '$/schema/AiProviderCatalogEntry.ts'
import AiRelationshipClaimSchema from '$/schema/AiRelationshipClaim.ts'
import AlgorandAccount_TimestampSchema from '$/schema/AlgorandAccount_Timestamp.ts'
import AlgorandAccountSchema from '$/schema/AlgorandAccount.ts'
import AlgorandApplication_TimestampSchema from '$/schema/AlgorandApplication_Timestamp.ts'
import AlgorandApplicationSchema from '$/schema/AlgorandApplication.ts'
import AlgorandApplicationLocalState_RoundSchema from '$/schema/AlgorandApplicationLocalState_Round.ts'
import AlgorandAsset_TimestampSchema from '$/schema/AlgorandAsset_Timestamp.ts'
import AlgorandAssetSchema from '$/schema/AlgorandAsset.ts'
import AlgorandAssetHolding_RoundSchema from '$/schema/AlgorandAssetHolding_Round.ts'
import AlgorandBox_RoundSchema from '$/schema/AlgorandBox_Round.ts'
import AlgorandBoxSchema from '$/schema/AlgorandBox.ts'
import AlgorandNetwork_TimestampSchema from '$/schema/AlgorandNetwork_Timestamp.ts'
import AlgorandNetworkSchema from '$/schema/AlgorandNetwork.ts'
import AlgorandRoundSchema from '$/schema/AlgorandRound.ts'
import AlgorandTealProgram_TimestampSchema from '$/schema/AlgorandTealProgram_Timestamp.ts'
import AlgorandTealProgramSchema from '$/schema/AlgorandTealProgram.ts'
import AlgorandTransactionSchema from '$/schema/AlgorandTransaction.ts'
import AlgorandTransactionGroupSchema from '$/schema/AlgorandTransactionGroup.ts'
import AlgorandTransactionProofSchema from '$/schema/AlgorandTransactionProof.ts'
import AptosAccount_TimestampSchema from '$/schema/AptosAccount_Timestamp.ts'
import AptosAccountSchema from '$/schema/AptosAccount.ts'
import AptosAccountResource_TimestampSchema from '$/schema/AptosAccountResource_Timestamp.ts'
import AptosAccountResourceSchema from '$/schema/AptosAccountResource.ts'
import AptosBlockSchema from '$/schema/AptosBlock.ts'
import AptosCoinBalance_TimestampSchema from '$/schema/AptosCoinBalance_Timestamp.ts'
import AptosEventSchema from '$/schema/AptosEvent.ts'
import AptosNetwork_TimestampSchema from '$/schema/AptosNetwork_Timestamp.ts'
import AptosNetworkSchema from '$/schema/AptosNetwork.ts'
import AptosStateChangeSchema from '$/schema/AptosStateChange.ts'
import AptosTableItem_TimestampSchema from '$/schema/AptosTableItem_Timestamp.ts'
import AptosTableItemSchema from '$/schema/AptosTableItem.ts'
import AptosTransaction_TimestampSchema from '$/schema/AptosTransaction_Timestamp.ts'
import AptosTransactionSchema from '$/schema/AptosTransaction.ts'
import ArweaveBlockSchema from '$/schema/ArweaveBlock.ts'
import ArweaveNetwork_TimestampSchema from '$/schema/ArweaveNetwork_Timestamp.ts'
import ArweaveNetworkSchema from '$/schema/ArweaveNetwork.ts'
import ArweaveResource_TimestampSchema from '$/schema/ArweaveResource_Timestamp.ts'
import ArweaveResourceSchema from '$/schema/ArweaveResource.ts'
import ArweaveTransactionSchema from '$/schema/ArweaveTransaction.ts'
import AssetClassSchema from '$/schema/AssetClass.ts'
import AssetEligibilitySchema from '$/schema/AssetEligibility.ts'
import AssetFormatSupport_TimestampSchema from '$/schema/AssetFormatSupport_Timestamp.ts'
import AssetInstanceSchema from '$/schema/AssetInstance.ts'
import AssetObjectSchema from '$/schema/AssetObject.ts'
import AssetSupply_LedgerCoordinateSchema from '$/schema/AssetSupply_LedgerCoordinate.ts'
import AssetSupply_TimestampSchema from '$/schema/AssetSupply_Timestamp.ts'
import AtprotoActor_TimestampSchema from '$/schema/AtprotoActor_Timestamp.ts'
import AtprotoActorSchema from '$/schema/AtprotoActor.ts'
import AtprotoNetworkSchema from '$/schema/AtprotoNetwork.ts'
import AtprotoPost_TimestampSchema from '$/schema/AtprotoPost_Timestamp.ts'
import AtprotoPostSchema from '$/schema/AtprotoPost.ts'
import AtprotoRepoCommitSchema from '$/schema/AtprotoRepoCommit.ts'
import AvailAppId_TimestampSchema from '$/schema/AvailAppId_Timestamp.ts'
import AvailAppIdSchema from '$/schema/AvailAppId.ts'
import AvailBlockSchema from '$/schema/AvailBlock.ts'
import AvailDataSubmissionSchema from '$/schema/AvailDataSubmission.ts'
import AvailNetwork_TimestampSchema from '$/schema/AvailNetwork_Timestamp.ts'
import AvailNetworkSchema from '$/schema/AvailNetwork.ts'
import AvalancheBlockchainSchema from '$/schema/AvalancheBlockchain.ts'
import AvalancheDelegatorSchema from '$/schema/AvalancheDelegator.ts'
import AvalanchePChainBlockSchema from '$/schema/AvalanchePChainBlock.ts'
import AvalanchePChainTransaction_TimestampSchema from '$/schema/AvalanchePChainTransaction_Timestamp.ts'
import AvalanchePChainTransactionSchema from '$/schema/AvalanchePChainTransaction.ts'
import AvalancheSubnet_TimestampSchema from '$/schema/AvalancheSubnet_Timestamp.ts'
import AvalancheSubnetSchema from '$/schema/AvalancheSubnet.ts'
import AvalancheValidator_TimestampSchema from '$/schema/AvalancheValidator_Timestamp.ts'
import AvalancheValidatorSchema from '$/schema/AvalancheValidator.ts'
import BeaconAttestationSchema from '$/schema/BeaconAttestation.ts'
import BeaconCommitteeSchema from '$/schema/BeaconCommittee.ts'
import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
import BeaconSlashingSchema from '$/schema/BeaconSlashing.ts'
import BeaconSlotSchema from '$/schema/BeaconSlot.ts'
import BeaconSyncCommitteeSchema from '$/schema/BeaconSyncCommittee.ts'
import BeaconValidator_TimestampSchema from '$/schema/BeaconValidator_Timestamp.ts'
import BeaconValidatorSchema from '$/schema/BeaconValidator.ts'
import BeaconWithdrawalSchema from '$/schema/BeaconWithdrawal.ts'
import BitcoinCashBcmrMetadataSchema from '$/schema/BitcoinCashBcmrMetadata.ts'
import BitcoinCashCashTokenCategorySchema from '$/schema/BitcoinCashCashTokenCategory.ts'
import BitcoinCashCashTokenCommitmentSchema from '$/schema/BitcoinCashCashTokenCommitment.ts'
import BitcoinCashCashTokenFungibleAmountSchema from '$/schema/BitcoinCashCashTokenFungibleAmount.ts'
import BitcoinCashCashTokenNftSchema from '$/schema/BitcoinCashCashTokenNft.ts'
import BittensorBlockSchema from '$/schema/BittensorBlock.ts'
import BittensorMetagraph_TimestampSchema from '$/schema/BittensorMetagraph_Timestamp.ts'
import BittensorNetwork_TimestampSchema from '$/schema/BittensorNetwork_Timestamp.ts'
import BittensorNetworkSchema from '$/schema/BittensorNetwork.ts'
import BittensorNeuronSchema from '$/schema/BittensorNeuron.ts'
import BittensorSubnetSchema from '$/schema/BittensorSubnet.ts'
import BitTorrentAnnounce_TimestampSchema from '$/schema/BitTorrentAnnounce_Timestamp.ts'
import BitTorrentDhtLookup_TimestampSchema from '$/schema/BitTorrentDhtLookup_Timestamp.ts'
import BitTorrentDhtNode_TimestampSchema from '$/schema/BitTorrentDhtNode_Timestamp.ts'
import BitTorrentFileSchema from '$/schema/BitTorrentFile.ts'
import BitTorrentFileTreeEntrySchema from '$/schema/BitTorrentFileTreeEntry.ts'
import BitTorrentMetainfoSchema from '$/schema/BitTorrentMetainfo.ts'
import BitTorrentPeer_TimestampSchema from '$/schema/BitTorrentPeer_Timestamp.ts'
import BitTorrentPieceSchema from '$/schema/BitTorrentPiece.ts'
import BitTorrentSwarmObservation_TimestampSchema from '$/schema/BitTorrentSwarmObservation_Timestamp.ts'
import BitTorrentTrackerSchema from '$/schema/BitTorrentTracker.ts'
import BitTorrentTrackerScrape_TimestampSchema from '$/schema/BitTorrentTrackerScrape_Timestamp.ts'
import BlockheadAccountSchema from '$/schema/BlockheadAccount.ts'
import BlockheadActionOutcome_TimestampSchema from '$/schema/BlockheadActionOutcome_Timestamp.ts'
import BlockheadActionOutcomeSchema from '$/schema/BlockheadActionOutcome.ts'
import BlockheadActionReadinessCheck_TimestampSchema from '$/schema/BlockheadActionReadinessCheck_Timestamp.ts'
import BlockheadActionReadinessCheckSchema from '$/schema/BlockheadActionReadinessCheck.ts'
import BlockheadAgentConnection_TimestampSchema from '$/schema/BlockheadAgentConnection_Timestamp.ts'
import BlockheadAgentConnectionSchema from '$/schema/BlockheadAgentConnection.ts'
import BlockheadAgentConversationSchema from '$/schema/BlockheadAgentConversation.ts'
import BlockheadAgentConversationTurnSchema from '$/schema/BlockheadAgentConversationTurn.ts'
import BlockheadAgentCredentialState_TimestampSchema from '$/schema/BlockheadAgentCredentialState_Timestamp.ts'
import BlockheadAgentCredentialStateSchema from '$/schema/BlockheadAgentCredentialState.ts'
import BlockheadAgentProfileSchema from '$/schema/BlockheadAgentProfile.ts'
import BlockheadAgentProgramInstall_TimestampSchema from '$/schema/BlockheadAgentProgramInstall_Timestamp.ts'
import BlockheadAgentProgramInstallSchema from '$/schema/BlockheadAgentProgramInstall.ts'
import BlockheadAgentProviderCallSchema from '$/schema/BlockheadAgentProviderCall.ts'
import BlockheadAlgorandParticipationKeySchema from '$/schema/BlockheadAlgorandParticipationKey.ts'
import BlockheadAlgorandPendingTransactionSchema from '$/schema/BlockheadAlgorandPendingTransaction.ts'
import BlockheadAvalancheNodeState_TimestampSchema from '$/schema/BlockheadAvalancheNodeState_Timestamp.ts'
import BlockheadAvalancheNodeStateSchema from '$/schema/BlockheadAvalancheNodeState.ts'
import BlockheadBitTorrentClientState_TimestampSchema from '$/schema/BlockheadBitTorrentClientState_Timestamp.ts'
import BlockheadBitTorrentClientStateSchema from '$/schema/BlockheadBitTorrentClientState.ts'
import BlockheadBitTorrentTransfer_TimestampSchema from '$/schema/BlockheadBitTorrentTransfer_Timestamp.ts'
import BlockheadBridgeIntentSchema from '$/schema/BlockheadBridgeIntent.ts'
import BlockheadBridgeTransactionSchema from '$/schema/BlockheadBridgeTransaction.ts'
import BlockheadCashuMeltQuote_TimestampSchema from '$/schema/BlockheadCashuMeltQuote_Timestamp.ts'
import BlockheadCashuMeltQuoteSchema from '$/schema/BlockheadCashuMeltQuote.ts'
import BlockheadCashuMintQuote_TimestampSchema from '$/schema/BlockheadCashuMintQuote_Timestamp.ts'
import BlockheadCashuMintQuoteSchema from '$/schema/BlockheadCashuMintQuote.ts'
import BlockheadCashuProof_TimestampSchema from '$/schema/BlockheadCashuProof_Timestamp.ts'
import BlockheadCashuProofSchema from '$/schema/BlockheadCashuProof.ts'
import BlockheadCashuTokenSchema from '$/schema/BlockheadCashuToken.ts'
import BlockheadCashuWalletState_TimestampSchema from '$/schema/BlockheadCashuWalletState_Timestamp.ts'
import BlockheadCashuWalletStateSchema from '$/schema/BlockheadCashuWalletState.ts'
import BlockheadCodexStorageNodeState_TimestampSchema from '$/schema/BlockheadCodexStorageNodeState_Timestamp.ts'
import BlockheadCodexStorageNodeStateSchema from '$/schema/BlockheadCodexStorageNodeState.ts'
import BlockheadCodexStoredData_TimestampSchema from '$/schema/BlockheadCodexStoredData_Timestamp.ts'
import BlockheadCodexStoredDataSchema from '$/schema/BlockheadCodexStoredData.ts'
import BlockheadEnsNameSearchSchema from '$/schema/BlockheadEnsNameSearch.ts'
import BlockheadEvmWalletRequestSchema from '$/schema/BlockheadEvmWalletRequest.ts'
import BlockheadFarcasterAccountConnectionSchema from '$/schema/BlockheadFarcasterAccountConnection.ts'
import BlockheadFedimintClientState_TimestampSchema from '$/schema/BlockheadFedimintClientState_Timestamp.ts'
import BlockheadFedimintClientStateSchema from '$/schema/BlockheadFedimintClientState.ts'
import BlockheadFilecoinPendingMessageSchema from '$/schema/BlockheadFilecoinPendingMessage.ts'
import BlockheadIntentInvocationSchema from '$/schema/BlockheadIntentInvocation.ts'
import BlockheadIntentOrder_TimestampSchema from '$/schema/BlockheadIntentOrder_Timestamp.ts'
import BlockheadIntentOrderSchema from '$/schema/BlockheadIntentOrder.ts'
import BlockheadIntentQuote_TimestampSchema from '$/schema/BlockheadIntentQuote_Timestamp.ts'
import BlockheadIntentQuoteSchema from '$/schema/BlockheadIntentQuote.ts'
import BlockheadKaspaNodeState_TimestampSchema from '$/schema/BlockheadKaspaNodeState_Timestamp.ts'
import BlockheadKaspaNodeStateSchema from '$/schema/BlockheadKaspaNodeState.ts'
import BlockheadLightningChannelState_TimestampSchema from '$/schema/BlockheadLightningChannelState_Timestamp.ts'
import BlockheadLightningChannelStateSchema from '$/schema/BlockheadLightningChannelState.ts'
import BlockheadLightningHtlcSchema from '$/schema/BlockheadLightningHtlc.ts'
import BlockheadLightningInvoice_TimestampSchema from '$/schema/BlockheadLightningInvoice_Timestamp.ts'
import BlockheadLightningInvoiceSchema from '$/schema/BlockheadLightningInvoice.ts'
import BlockheadLightningNodeState_TimestampSchema from '$/schema/BlockheadLightningNodeState_Timestamp.ts'
import BlockheadLightningNodeStateSchema from '$/schema/BlockheadLightningNodeState.ts'
import BlockheadLightningPayment_TimestampSchema from '$/schema/BlockheadLightningPayment_Timestamp.ts'
import BlockheadLightningPaymentSchema from '$/schema/BlockheadLightningPayment.ts'
import BlockheadLitecoinMwebOutputState_TimestampSchema from '$/schema/BlockheadLitecoinMwebOutputState_Timestamp.ts'
import BlockheadLitecoinMwebOutputStateSchema from '$/schema/BlockheadLitecoinMwebOutputState.ts'
import BlockheadLitecoinMwebWalletState_TimestampSchema from '$/schema/BlockheadLitecoinMwebWalletState_Timestamp.ts'
import BlockheadLitecoinMwebWalletStateSchema from '$/schema/BlockheadLitecoinMwebWalletState.ts'
import BlockheadLocalMediaIngest_TimestampSchema from '$/schema/BlockheadLocalMediaIngest_Timestamp.ts'
import BlockheadLocalMediaIngestSchema from '$/schema/BlockheadLocalMediaIngest.ts'
import BlockheadLogosBlockchainNodeState_TimestampSchema from '$/schema/BlockheadLogosBlockchainNodeState_Timestamp.ts'
import BlockheadLogosBlockchainNodeStateSchema from '$/schema/BlockheadLogosBlockchainNodeState.ts'
import BlockheadLogosBlockchainWalletKeyState_TimestampSchema from '$/schema/BlockheadLogosBlockchainWalletKeyState_Timestamp.ts'
import BlockheadLogosBlockchainWalletKeyStateSchema from '$/schema/BlockheadLogosBlockchainWalletKeyState.ts'
import BlockheadMoneroOutputState_TimestampSchema from '$/schema/BlockheadMoneroOutputState_Timestamp.ts'
import BlockheadMoneroOutputStateSchema from '$/schema/BlockheadMoneroOutputState.ts'
import BlockheadMoneroSubaddressState_TimestampSchema from '$/schema/BlockheadMoneroSubaddressState_Timestamp.ts'
import BlockheadMoneroSubaddressStateSchema from '$/schema/BlockheadMoneroSubaddressState.ts'
import BlockheadMoneroTransferState_TimestampSchema from '$/schema/BlockheadMoneroTransferState_Timestamp.ts'
import BlockheadMoneroTransferStateSchema from '$/schema/BlockheadMoneroTransferState.ts'
import BlockheadMoneroWalletState_TimestampSchema from '$/schema/BlockheadMoneroWalletState_Timestamp.ts'
import BlockheadMoneroWalletStateSchema from '$/schema/BlockheadMoneroWalletState.ts'
import BlockheadPanelSchema from '$/schema/BlockheadPanel.ts'
import BlockheadPanelTreeSchema from '$/schema/BlockheadPanelTree.ts'
import BlockheadPayjoinSessionSchema from '$/schema/BlockheadPayjoinSession.ts'
import BlockheadQuilibriumAccountState_TimestampSchema from '$/schema/BlockheadQuilibriumAccountState_Timestamp.ts'
import BlockheadQuilibriumAccountStateSchema from '$/schema/BlockheadQuilibriumAccountState.ts'
import BlockheadQuilibriumNodeState_TimestampSchema from '$/schema/BlockheadQuilibriumNodeState_Timestamp.ts'
import BlockheadQuilibriumNodeStateSchema from '$/schema/BlockheadQuilibriumNodeState.ts'
import BlockheadQuilibriumPendingTransactionSchema from '$/schema/BlockheadQuilibriumPendingTransaction.ts'
import BlockheadRadicleNodeInventory_TimestampSchema from '$/schema/BlockheadRadicleNodeInventory_Timestamp.ts'
import BlockheadRadicleNodeState_TimestampSchema from '$/schema/BlockheadRadicleNodeState_Timestamp.ts'
import BlockheadRadicleNodeStateSchema from '$/schema/BlockheadRadicleNodeState.ts'
import BlockheadRadiclePeerSchema from '$/schema/BlockheadRadiclePeer.ts'
import BlockheadRadicleSeedObservation_TimestampSchema from '$/schema/BlockheadRadicleSeedObservation_Timestamp.ts'
import BlockheadRadicleSyncSessionSchema from '$/schema/BlockheadRadicleSyncSession.ts'
import BlockheadRoomSchema from '$/schema/BlockheadRoom.ts'
import BlockheadRoomPeerSchema from '$/schema/BlockheadRoomPeer.ts'
import BlockheadSessionSchema from '$/schema/BlockheadSession.ts'
import BlockheadSessionActionSchema from '$/schema/BlockheadSessionAction.ts'
import BlockheadSessionSimulationSchema from '$/schema/BlockheadSessionSimulation.ts'
import BlockheadSessionSimulationCallSchema from '$/schema/BlockheadSessionSimulationCall.ts'
import BlockheadSessionSimulationLogSchema from '$/schema/BlockheadSessionSimulationLog.ts'
import BlockheadSharedAddressSchema from '$/schema/BlockheadSharedAddress.ts'
import BlockheadSiweChallengeSchema from '$/schema/BlockheadSiweChallenge.ts'
import BlockheadSocialPostSessionSchema from '$/schema/BlockheadSocialPostSession.ts'
import BlockheadSource_TimestampSchema from '$/schema/BlockheadSource_Timestamp.ts'
import BlockheadSourceSchema from '$/schema/BlockheadSource.ts'
import BlockheadStateChannel_TimestampSchema from '$/schema/BlockheadStateChannel_Timestamp.ts'
import BlockheadStateChannelSchema from '$/schema/BlockheadStateChannel.ts'
import BlockheadStateChannelDeposit_TimestampSchema from '$/schema/BlockheadStateChannelDeposit_Timestamp.ts'
import BlockheadStateChannelDepositSchema from '$/schema/BlockheadStateChannelDeposit.ts'
import BlockheadStateChannelStateSchema from '$/schema/BlockheadStateChannelState.ts'
import BlockheadStateChannelTransferSchema from '$/schema/BlockheadStateChannelTransfer.ts'
import BlockheadSwapIntentSchema from '$/schema/BlockheadSwapIntent.ts'
import BlockheadTransferIntentSchema from '$/schema/BlockheadTransferIntent.ts'
import BlockheadTransferRequestSchema from '$/schema/BlockheadTransferRequest.ts'
import BlockheadWakuMessageObservation_TimestampSchema from '$/schema/BlockheadWakuMessageObservation_Timestamp.ts'
import BlockheadWakuNodeState_TimestampSchema from '$/schema/BlockheadWakuNodeState_Timestamp.ts'
import BlockheadWakuNodeStateSchema from '$/schema/BlockheadWakuNodeState.ts'
import BlockheadWalletSchema from '$/schema/BlockheadWallet.ts'
import BlockheadWalletAuthenticationSchema from '$/schema/BlockheadWalletAuthentication.ts'
import BlockheadWalletCapabilityGrantSchema from '$/schema/BlockheadWalletCapabilityGrant.ts'
import BlockheadWalletConnectionSchema from '$/schema/BlockheadWalletConnection.ts'
import BlockheadWalletRequest_TimestampSchema from '$/schema/BlockheadWalletRequest_Timestamp.ts'
import BlockheadWalletRequestSchema from '$/schema/BlockheadWalletRequest.ts'
import BlockheadWalletRequestCallSchema from '$/schema/BlockheadWalletRequestCall.ts'
import BlockheadWalletTransportSessionSchema from '$/schema/BlockheadWalletTransportSession.ts'
import BlockheadWorkspaceSchema from '$/schema/BlockheadWorkspace.ts'
import BlockheadZcashNoteState_TimestampSchema from '$/schema/BlockheadZcashNoteState_Timestamp.ts'
import BlockheadZcashNoteStateSchema from '$/schema/BlockheadZcashNoteState.ts'
import BlockheadZcashViewingKey_TimestampSchema from '$/schema/BlockheadZcashViewingKey_Timestamp.ts'
import BlockheadZcashViewingKeySchema from '$/schema/BlockheadZcashViewingKey.ts'
import BlockheadZcashWalletState_TimestampSchema from '$/schema/BlockheadZcashWalletState_Timestamp.ts'
import BlockheadZcashWalletStateSchema from '$/schema/BlockheadZcashWalletState.ts'
import BlockheadZeroGStorageNodeState_TimestampSchema from '$/schema/BlockheadZeroGStorageNodeState_Timestamp.ts'
import BlockheadZeroGStorageNodeStateSchema from '$/schema/BlockheadZeroGStorageNodeState.ts'
import BlockheadZeroGStorageProofSchema from '$/schema/BlockheadZeroGStorageProof.ts'
import BlockheadZeroGStoredChunkSchema from '$/schema/BlockheadZeroGStoredChunk.ts'
import BnbBeaconBlockSchema from '$/schema/BnbBeaconBlock.ts'
import BnbBeaconNetwork_TimestampSchema from '$/schema/BnbBeaconNetwork_Timestamp.ts'
import BnbBeaconNetworkSchema from '$/schema/BnbBeaconNetwork.ts'
import BnbBeaconToken_TimestampSchema from '$/schema/BnbBeaconToken_Timestamp.ts'
import BnbBeaconTokenSchema from '$/schema/BnbBeaconToken.ts'
import BnbBeaconTokenMigration_TimestampSchema from '$/schema/BnbBeaconTokenMigration_Timestamp.ts'
import BnbBeaconTokenMigrationSchema from '$/schema/BnbBeaconTokenMigration.ts'
import BnbBeaconTokenTransferSchema from '$/schema/BnbBeaconTokenTransfer.ts'
import BnbBeaconTransactionSchema from '$/schema/BnbBeaconTransaction.ts'
import BnbValidator_TimestampSchema from '$/schema/BnbValidator_Timestamp.ts'
import BnbValidatorSchema from '$/schema/BnbValidator.ts'
import BridgeRouteSchema from '$/schema/BridgeRoute.ts'
import BridgeRouteQuote_TimestampSchema from '$/schema/BridgeRouteQuote_Timestamp.ts'
import BridgeRouteQuoteStepSchema from '$/schema/BridgeRouteQuoteStep.ts'
import BridgeRouteStepSchema from '$/schema/BridgeRouteStep.ts'
import BridgeTransfer_TimestampSchema from '$/schema/BridgeTransfer_Timestamp.ts'
import BridgeTransferSchema from '$/schema/BridgeTransfer.ts'
import CardanoAddress_TimestampSchema from '$/schema/CardanoAddress_Timestamp.ts'
import CardanoAddressSchema from '$/schema/CardanoAddress.ts'
import CardanoBlockSchema from '$/schema/CardanoBlock.ts'
import CardanoCertificateSchema from '$/schema/CardanoCertificate.ts'
import CardanoCommittee_EpochSchema from '$/schema/CardanoCommittee_Epoch.ts'
import CardanoConstitution_EpochSchema from '$/schema/CardanoConstitution_Epoch.ts'
import CardanoDRep_TimestampSchema from '$/schema/CardanoDRep_Timestamp.ts'
import CardanoDRepSchema from '$/schema/CardanoDRep.ts'
import CardanoGovernanceProposal_TimestampSchema from '$/schema/CardanoGovernanceProposal_Timestamp.ts'
import CardanoGovernanceProposalSchema from '$/schema/CardanoGovernanceProposal.ts'
import CardanoGovernanceVoteSchema from '$/schema/CardanoGovernanceVote.ts'
import CardanoNativeAsset_TimestampSchema from '$/schema/CardanoNativeAsset_Timestamp.ts'
import CardanoNativeAssetSchema from '$/schema/CardanoNativeAsset.ts'
import CardanoNetwork_TimestampSchema from '$/schema/CardanoNetwork_Timestamp.ts'
import CardanoProtocolParameters_EpochSchema from '$/schema/CardanoProtocolParameters_Epoch.ts'
import CardanoScriptWitnessSchema from '$/schema/CardanoScriptWitness.ts'
import CardanoStakeCredentialSchema from '$/schema/CardanoStakeCredential.ts'
import CardanoStakeDelegation_EpochSchema from '$/schema/CardanoStakeDelegation_Epoch.ts'
import CardanoStakePool_TimestampSchema from '$/schema/CardanoStakePool_Timestamp.ts'
import CardanoStakePoolSchema from '$/schema/CardanoStakePool.ts'
import CardanoTransactionSchema from '$/schema/CardanoTransaction.ts'
import CardanoTxInputSchema from '$/schema/CardanoTxInput.ts'
import CardanoTxOutputSchema from '$/schema/CardanoTxOutput.ts'
import CardanoTxOutputAssetSchema from '$/schema/CardanoTxOutputAsset.ts'
import CashuKeyset_TimestampSchema from '$/schema/CashuKeyset_Timestamp.ts'
import CashuKeysetSchema from '$/schema/CashuKeyset.ts'
import CashuMint_TimestampSchema from '$/schema/CashuMint_Timestamp.ts'
import CashuMintSchema from '$/schema/CashuMint.ts'
import CctpAllowanceSchema from '$/schema/CctpAllowance.ts'
import CctpAttestation_TimestampSchema from '$/schema/CctpAttestation_Timestamp.ts'
import CctpBurnFee_TimestampSchema from '$/schema/CctpBurnFee_Timestamp.ts'
import CctpDomainSupportSchema from '$/schema/CctpDomainSupport.ts'
import CctpFastBurnAllowance_TimestampSchema from '$/schema/CctpFastBurnAllowance_Timestamp.ts'
import CctpFeeSchema from '$/schema/CctpFee.ts'
import CctpMessageSchema from '$/schema/CctpMessage.ts'
import CelestiaBlobSchema from '$/schema/CelestiaBlob.ts'
import CelestiaBlockSchema from '$/schema/CelestiaBlock.ts'
import CelestiaNamespace_TimestampSchema from '$/schema/CelestiaNamespace_Timestamp.ts'
import CelestiaNamespaceSchema from '$/schema/CelestiaNamespace.ts'
import CelestiaNetwork_TimestampSchema from '$/schema/CelestiaNetwork_Timestamp.ts'
import CelestiaNetworkSchema from '$/schema/CelestiaNetwork.ts'
import ClaimTopicRequirementSchema from '$/schema/ClaimTopicRequirement.ts'
import CodexDatasetSchema from '$/schema/CodexDataset.ts'
import Coin_TimestampSchema from '$/schema/Coin_Timestamp.ts'
import CoinSchema from '$/schema/Coin.ts'
import CoinBridgeCapabilitySchema from '$/schema/CoinBridgeCapability.ts'
import ComplianceModuleSchema from '$/schema/ComplianceModule.ts'
import ContractInterfaceMemberSchema from '$/schema/ContractInterfaceMember.ts'
import CosmosAccount_TimestampSchema from '$/schema/CosmosAccount_Timestamp.ts'
import CosmosAccountSchema from '$/schema/CosmosAccount.ts'
import CosmosBlockSchema from '$/schema/CosmosBlock.ts'
import CosmosContractSchema from '$/schema/CosmosContract.ts'
import CosmosDenomSchema from '$/schema/CosmosDenom.ts'
import CosmosGovernanceProposal_TimestampSchema from '$/schema/CosmosGovernanceProposal_Timestamp.ts'
import CosmosGovernanceProposalSchema from '$/schema/CosmosGovernanceProposal.ts'
import CosmosMessageSchema from '$/schema/CosmosMessage.ts'
import CosmosModuleSchema from '$/schema/CosmosModule.ts'
import CosmosTransactionSchema from '$/schema/CosmosTransaction.ts'
import CosmosValidator_TimestampSchema from '$/schema/CosmosValidator_Timestamp.ts'
import CosmosValidatorSchema from '$/schema/CosmosValidator.ts'
import CronosNetworkProfileSchema from '$/schema/CronosNetworkProfile.ts'
import Currency_TimestampSchema from '$/schema/Currency_Timestamp.ts'
import CurrencySchema from '$/schema/Currency.ts'
import DogecoinAuxPowMerkleBranchSchema from '$/schema/DogecoinAuxPowMerkleBranch.ts'
import DogecoinAuxPowParentBlockHeaderSchema from '$/schema/DogecoinAuxPowParentBlockHeader.ts'
import DogecoinBlockAuxPowSchema from '$/schema/DogecoinBlockAuxPow.ts'
import DydxChainMarket_TimestampSchema from '$/schema/DydxChainMarket_Timestamp.ts'
import DydxChainMarketSchema from '$/schema/DydxChainMarket.ts'
import DydxChainNetwork_TimestampSchema from '$/schema/DydxChainNetwork_Timestamp.ts'
import DydxChainNetworkSchema from '$/schema/DydxChainNetwork.ts'
import DydxChainOrder_TimestampSchema from '$/schema/DydxChainOrder_Timestamp.ts'
import DydxChainOrderSchema from '$/schema/DydxChainOrder.ts'
import DydxChainPerpetualPosition_TimestampSchema from '$/schema/DydxChainPerpetualPosition_Timestamp.ts'
import DydxChainSubaccount_TimestampSchema from '$/schema/DydxChainSubaccount_Timestamp.ts'
import DydxChainSubaccountSchema from '$/schema/DydxChainSubaccount.ts'
import EasAttestation_TimestampSchema from '$/schema/EasAttestation_Timestamp.ts'
import EasAttestationSchema from '$/schema/EasAttestation.ts'
import EasSchemaSchema from '$/schema/EasSchema.ts'
import EigenLayerAllocation_TimestampSchema from '$/schema/EigenLayerAllocation_Timestamp.ts'
import EigenLayerAvs_TimestampSchema from '$/schema/EigenLayerAvs_Timestamp.ts'
import EigenLayerAvsSchema from '$/schema/EigenLayerAvs.ts'
import EigenLayerDelegation_TimestampSchema from '$/schema/EigenLayerDelegation_Timestamp.ts'
import EigenLayerOperatorSchema from '$/schema/EigenLayerOperator.ts'
import EigenLayerProtocolSchema from '$/schema/EigenLayerProtocol.ts'
import EigenLayerReward_TimestampSchema from '$/schema/EigenLayerReward_Timestamp.ts'
import EigenLayerSlashingEventSchema from '$/schema/EigenLayerSlashingEvent.ts'
import EigenLayerStrategy_TimestampSchema from '$/schema/EigenLayerStrategy_Timestamp.ts'
import EigenLayerStrategySchema from '$/schema/EigenLayerStrategy.ts'
import Eip7702AuthorizationSchema from '$/schema/Eip7702Authorization.ts'
import Eip8004AgentRegistration_TimestampSchema from '$/schema/Eip8004AgentRegistration_Timestamp.ts'
import Eip8004AgentRegistrationSchema from '$/schema/Eip8004AgentRegistration.ts'
import Eip8004AgentRegistrationFileSchema from '$/schema/Eip8004AgentRegistrationFile.ts'
import Eip8004AgentServiceEndpointSchema from '$/schema/Eip8004AgentServiceEndpoint.ts'
import Eip8004CrossRegistrationSchema from '$/schema/Eip8004CrossRegistration.ts'
import Eip8004EndpointDomainVerification_TimestampSchema from '$/schema/Eip8004EndpointDomainVerification_Timestamp.ts'
import Eip8004ReputationFeedback_TimestampSchema from '$/schema/Eip8004ReputationFeedback_Timestamp.ts'
import Eip8004Validation_TimestampSchema from '$/schema/Eip8004Validation_Timestamp.ts'
import ElementsAsset_TimestampSchema from '$/schema/ElementsAsset_Timestamp.ts'
import ElementsAssetSchema from '$/schema/ElementsAsset.ts'
import ElementsIssuanceSchema from '$/schema/ElementsIssuance.ts'
import ElementsNetworkSchema from '$/schema/ElementsNetwork.ts'
import ElementsPeg_TimestampSchema from '$/schema/ElementsPeg_Timestamp.ts'
import ElementsPegSchema from '$/schema/ElementsPeg.ts'
import EnsName_TimestampSchema from '$/schema/EnsName_Timestamp.ts'
import EnsNameSchema from '$/schema/EnsName.ts'
import EnsRecord_TimestampSchema from '$/schema/EnsRecord_Timestamp.ts'
import EnsRecordSchema from '$/schema/EnsRecord.ts'
import EnsReverseRecord_TimestampSchema from '$/schema/EnsReverseRecord_Timestamp.ts'
import EnsReverseRecordSchema from '$/schema/EnsReverseRecord.ts'
import Erc4337AccountFactory_TimestampSchema from '$/schema/Erc4337AccountFactory_Timestamp.ts'
import Erc4337AccountFactorySchema from '$/schema/Erc4337AccountFactory.ts'
import Erc4337Bundler_TimestampSchema from '$/schema/Erc4337Bundler_Timestamp.ts'
import Erc4337BundlerSchema from '$/schema/Erc4337Bundler.ts'
import Erc4337Paymaster_TimestampSchema from '$/schema/Erc4337Paymaster_Timestamp.ts'
import Erc4337PaymasterSchema from '$/schema/Erc4337Paymaster.ts'
import Erc4337SmartAccount_TimestampSchema from '$/schema/Erc4337SmartAccount_Timestamp.ts'
import Erc4337SmartAccountSchema from '$/schema/Erc4337SmartAccount.ts'
import Erc4626Vault_BlockSchema from '$/schema/Erc4626Vault_Block.ts'
import Erc4626Vault_TimestampSchema from '$/schema/Erc4626Vault_Timestamp.ts'
import Erc4626VaultSchema from '$/schema/Erc4626Vault.ts'
import EthereumBeaconFinality_TimestampSchema from '$/schema/EthereumBeaconFinality_Timestamp.ts'
import EthereumConsensusUpgradeSchema from '$/schema/EthereumConsensusUpgrade.ts'
import EthereumExecutionUpgradeSchema from '$/schema/EthereumExecutionUpgrade.ts'
import EthereumNetworkUpgradeSchema from '$/schema/EthereumNetworkUpgrade.ts'
import EvmAccountSchema from '$/schema/EvmAccount.ts'
import EvmActorCoinAllowance_BlockSchema from '$/schema/EvmActorCoinAllowance_Block.ts'
import EvmActorCoinAllowanceSchema from '$/schema/EvmActorCoinAllowance.ts'
import EvmBlobSchema from '$/schema/EvmBlob.ts'
import EvmBlockSchema from '$/schema/EvmBlock.ts'
import EvmCalldataSchema from '$/schema/EvmCalldata.ts'
import EvmCoinInstanceSchema from '$/schema/EvmCoinInstance.ts'
import EvmContractSchema from '$/schema/EvmContract.ts'
import EvmContractCompilationSchema from '$/schema/EvmContractCompilation.ts'
import EvmContractSourceBundleSchema from '$/schema/EvmContractSourceBundle.ts'
import EvmContractVerificationSchema from '$/schema/EvmContractVerification.ts'
import EvmError_TimestampSchema from '$/schema/EvmError_Timestamp.ts'
import EvmErrorSchema from '$/schema/EvmError.ts'
import EvmInternalTransferSchema from '$/schema/EvmInternalTransfer.ts'
import EvmLogSchema from '$/schema/EvmLog.ts'
import EvmNetwork_GasEstimate_TimestampSchema from '$/schema/EvmNetwork_GasEstimate_Timestamp.ts'
import EvmNetwork_GasFee_BlockSchema from '$/schema/EvmNetwork_GasFee_Block.ts'
import EvmNetwork_TimestampSchema from '$/schema/EvmNetwork_Timestamp.ts'
import EvmNetwork_Txpool_TimestampSchema from '$/schema/EvmNetwork_Txpool_Timestamp.ts'
import EvmNetworkAccount_TimestampSchema from '$/schema/EvmNetworkAccount_Timestamp.ts'
import EvmNetworkAccountSchema from '$/schema/EvmNetworkAccount.ts'
import EvmNetworkActorCoinBalance_EvmBlockSchema from '$/schema/EvmNetworkActorCoinBalance_EvmBlock.ts'
import EvmNetworkActorCoinBalance_TimestampSchema from '$/schema/EvmNetworkActorCoinBalance_Timestamp.ts'
import EvmNetworkActorCoinBalanceSchema from '$/schema/EvmNetworkActorCoinBalance.ts'
import EvmNetworkBridgeSchema from '$/schema/EvmNetworkBridge.ts'
import EvmNftSchema from '$/schema/EvmNft.ts'
import EvmProtocolSchema from '$/schema/EvmProtocol.ts'
import EvmRollup_TimestampSchema from '$/schema/EvmRollup_Timestamp.ts'
import EvmRollupSchema from '$/schema/EvmRollup.ts'
import EvmSelector_TimestampSchema from '$/schema/EvmSelector_Timestamp.ts'
import EvmSelectorSchema from '$/schema/EvmSelector.ts'
import EvmStorageRead_TimestampSchema from '$/schema/EvmStorageRead_Timestamp.ts'
import EvmTokenTransferSchema from '$/schema/EvmTokenTransfer.ts'
import EvmTopic_TimestampSchema from '$/schema/EvmTopic_Timestamp.ts'
import EvmTopicSchema from '$/schema/EvmTopic.ts'
import EvmTraceSchema from '$/schema/EvmTrace.ts'
import EvmTransactionSchema from '$/schema/EvmTransaction.ts'
import EvmUserOperationSchema from '$/schema/EvmUserOperation.ts'
import FarcasterCast_TimestampSchema from '$/schema/FarcasterCast_Timestamp.ts'
import FarcasterCastSchema from '$/schema/FarcasterCast.ts'
import FarcasterCastEmbedSchema from '$/schema/FarcasterCastEmbed.ts'
import FarcasterChannel_TimestampSchema from '$/schema/FarcasterChannel_Timestamp.ts'
import FarcasterChannel_Viewer_TimestampSchema from '$/schema/FarcasterChannel_Viewer_Timestamp.ts'
import FarcasterChannelSchema from '$/schema/FarcasterChannel.ts'
import FarcasterFeedSchema from '$/schema/FarcasterFeed.ts'
import FarcasterNetworkSchema from '$/schema/FarcasterNetwork.ts'
import FarcasterUser_TimestampSchema from '$/schema/FarcasterUser_Timestamp.ts'
import FarcasterUserSchema from '$/schema/FarcasterUser.ts'
import FarcasterVerifiedAddressSchema from '$/schema/FarcasterVerifiedAddress.ts'
import FedimintFederation_TimestampSchema from '$/schema/FedimintFederation_Timestamp.ts'
import FedimintFederationSchema from '$/schema/FedimintFederation.ts'
import FedimintGateway_TimestampSchema from '$/schema/FedimintGateway_Timestamp.ts'
import FedimintGatewaySchema from '$/schema/FedimintGateway.ts'
import FilecoinActor_TimestampSchema from '$/schema/FilecoinActor_Timestamp.ts'
import FilecoinActorSchema from '$/schema/FilecoinActor.ts'
import FilecoinBlockSchema from '$/schema/FilecoinBlock.ts'
import FilecoinDeal_TimestampSchema from '$/schema/FilecoinDeal_Timestamp.ts'
import FilecoinDealSchema from '$/schema/FilecoinDeal.ts'
import FilecoinMessageSchema from '$/schema/FilecoinMessage.ts'
import FilecoinMessageReceiptSchema from '$/schema/FilecoinMessageReceipt.ts'
import FilecoinMiner_TimestampSchema from '$/schema/FilecoinMiner_Timestamp.ts'
import FilecoinMinerSchema from '$/schema/FilecoinMiner.ts'
import FilecoinNetwork_TimestampSchema from '$/schema/FilecoinNetwork_Timestamp.ts'
import FilecoinNetworkSchema from '$/schema/FilecoinNetwork.ts'
import FilecoinSector_TimestampSchema from '$/schema/FilecoinSector_Timestamp.ts'
import FilecoinSectorSchema from '$/schema/FilecoinSector.ts'
import FilecoinTipsetSchema from '$/schema/FilecoinTipset.ts'
import GitBlobSchema from '$/schema/GitBlob.ts'
import GitCommitSchema from '$/schema/GitCommit.ts'
import GitFetchObservationSchema from '$/schema/GitFetchObservation.ts'
import GitForgeIssueSchema from '$/schema/GitForgeIssue.ts'
import GitForgeMirrorSchema from '$/schema/GitForgeMirror.ts'
import GitForgePullRequestSchema from '$/schema/GitForgePullRequest.ts'
import GitForgeReleaseSchema from '$/schema/GitForgeRelease.ts'
import GitLooseObjectSchema from '$/schema/GitLooseObject.ts'
import GitObjectSchema from '$/schema/GitObject.ts'
import GitObjectVerification_TimestampSchema from '$/schema/GitObjectVerification_Timestamp.ts'
import GitPackedObjectSchema from '$/schema/GitPackedObject.ts'
import GitPackfileSchema from '$/schema/GitPackfile.ts'
import GitRefSchema from '$/schema/GitRef.ts'
import GitRefObservation_TimestampSchema from '$/schema/GitRefObservation_Timestamp.ts'
import GitRefUpdateSchema from '$/schema/GitRefUpdate.ts'
import GitRemoteSchema from '$/schema/GitRemote.ts'
import GitRepositorySchema from '$/schema/GitRepository.ts'
import GitSignatureSchema from '$/schema/GitSignature.ts'
import GitTagSchema from '$/schema/GitTag.ts'
import GitTreeSchema from '$/schema/GitTree.ts'
import GitTreeEntrySchema from '$/schema/GitTreeEntry.ts'
import GitTreePathResolutionSchema from '$/schema/GitTreePathResolution.ts'
import HederaAccount_TimestampSchema from '$/schema/HederaAccount_Timestamp.ts'
import HederaAccountSchema from '$/schema/HederaAccount.ts'
import HederaAllowance_TimestampSchema from '$/schema/HederaAllowance_Timestamp.ts'
import HederaAllowanceSchema from '$/schema/HederaAllowance.ts'
import HederaBlockSchema from '$/schema/HederaBlock.ts'
import HederaContract_TimestampSchema from '$/schema/HederaContract_Timestamp.ts'
import HederaContractSchema from '$/schema/HederaContract.ts'
import HederaContractActionSchema from '$/schema/HederaContractAction.ts'
import HederaContractLogSchema from '$/schema/HederaContractLog.ts'
import HederaContractResultSchema from '$/schema/HederaContractResult.ts'
import HederaContractState_TimestampSchema from '$/schema/HederaContractState_Timestamp.ts'
import HederaHbarTransferSchema from '$/schema/HederaHbarTransfer.ts'
import HederaNetwork_TimestampSchema from '$/schema/HederaNetwork_Timestamp.ts'
import HederaNetworkExchangeRate_TimestampSchema from '$/schema/HederaNetworkExchangeRate_Timestamp.ts'
import HederaNetworkFee_TimestampSchema from '$/schema/HederaNetworkFee_Timestamp.ts'
import HederaNetworkStake_TimestampSchema from '$/schema/HederaNetworkStake_Timestamp.ts'
import HederaNetworkSupply_TimestampSchema from '$/schema/HederaNetworkSupply_Timestamp.ts'
import HederaNft_TimestampSchema from '$/schema/HederaNft_Timestamp.ts'
import HederaNftSchema from '$/schema/HederaNft.ts'
import HederaNode_TimestampSchema from '$/schema/HederaNode_Timestamp.ts'
import HederaNodeSchema from '$/schema/HederaNode.ts'
import HederaSchedule_TimestampSchema from '$/schema/HederaSchedule_Timestamp.ts'
import HederaScheduleSchema from '$/schema/HederaSchedule.ts'
import HederaScheduleSignatureSchema from '$/schema/HederaScheduleSignature.ts'
import HederaToken_TimestampSchema from '$/schema/HederaToken_Timestamp.ts'
import HederaTokenSchema from '$/schema/HederaToken.ts'
import HederaTokenAssociation_TimestampSchema from '$/schema/HederaTokenAssociation_Timestamp.ts'
import HederaTokenAssociationSchema from '$/schema/HederaTokenAssociation.ts'
import HederaTokenCustomFeeSchema from '$/schema/HederaTokenCustomFee.ts'
import HederaTokenTransferSchema from '$/schema/HederaTokenTransfer.ts'
import HederaTopic_TimestampSchema from '$/schema/HederaTopic_Timestamp.ts'
import HederaTopicSchema from '$/schema/HederaTopic.ts'
import HederaTopicMessageSchema from '$/schema/HederaTopicMessage.ts'
import HederaTransactionSchema from '$/schema/HederaTransaction.ts'
import HyperliquidAccount_TimestampSchema from '$/schema/HyperliquidAccount_Timestamp.ts'
import HyperliquidAccountSchema from '$/schema/HyperliquidAccount.ts'
import HyperliquidBlockSchema from '$/schema/HyperliquidBlock.ts'
import HyperliquidFillSchema from '$/schema/HyperliquidFill.ts'
import HyperliquidMarket_TimeInterval_TimestampSchema from '$/schema/HyperliquidMarket_TimeInterval_Timestamp.ts'
import HyperliquidNetwork_TimestampSchema from '$/schema/HyperliquidNetwork_Timestamp.ts'
import HyperliquidNetworkSchema from '$/schema/HyperliquidNetwork.ts'
import HyperliquidOrder_TimestampSchema from '$/schema/HyperliquidOrder_Timestamp.ts'
import HyperliquidOrderSchema from '$/schema/HyperliquidOrder.ts'
import HyperliquidOrderbook_TimestampSchema from '$/schema/HyperliquidOrderbook_Timestamp.ts'
import HyperliquidPerpMarket_TimestampSchema from '$/schema/HyperliquidPerpMarket_Timestamp.ts'
import HyperliquidPerpMarketSchema from '$/schema/HyperliquidPerpMarket.ts'
import HyperliquidSpotAssetSchema from '$/schema/HyperliquidSpotAsset.ts'
import HyperliquidSpotPair_TimestampSchema from '$/schema/HyperliquidSpotPair_Timestamp.ts'
import HyperliquidSpotPairSchema from '$/schema/HyperliquidSpotPair.ts'
import HyperliquidTransaction_TimestampSchema from '$/schema/HyperliquidTransaction_Timestamp.ts'
import HyperliquidTransactionSchema from '$/schema/HyperliquidTransaction.ts'
import HyperliquidValidator_TimestampSchema from '$/schema/HyperliquidValidator_Timestamp.ts'
import HyperliquidValidatorSchema from '$/schema/HyperliquidValidator.ts'
import HyperliquidVault_TimestampSchema from '$/schema/HyperliquidVault_Timestamp.ts'
import HyperliquidVaultSchema from '$/schema/HyperliquidVault.ts'
import HyperliquidVaultEquity_TimestampSchema from '$/schema/HyperliquidVaultEquity_Timestamp.ts'
import IbcChannelSchema from '$/schema/IbcChannel.ts'
import IbcClientSchema from '$/schema/IbcClient.ts'
import IbcConnectionSchema from '$/schema/IbcConnection.ts'
import IbcDenomTraceSchema from '$/schema/IbcDenomTrace.ts'
import IbcPacketSchema from '$/schema/IbcPacket.ts'
import IcpCanister_TimestampSchema from '$/schema/IcpCanister_Timestamp.ts'
import IcpCanisterSchema from '$/schema/IcpCanister.ts'
import IcpCanisterLog_TimestampSchema from '$/schema/IcpCanisterLog_Timestamp.ts'
import IcpCanisterMetadata_TimestampSchema from '$/schema/IcpCanisterMetadata_Timestamp.ts'
import IcpCanisterMetadataSchema from '$/schema/IcpCanisterMetadata.ts'
import IcpCanisterMethod_TimestampSchema from '$/schema/IcpCanisterMethod_Timestamp.ts'
import IcpCanisterMethodSchema from '$/schema/IcpCanisterMethod.ts'
import IcpCertifiedStateSchema from '$/schema/IcpCertifiedState.ts'
import IcpLedgerAccount_TimestampSchema from '$/schema/IcpLedgerAccount_Timestamp.ts'
import IcpLedgerBlockSchema from '$/schema/IcpLedgerBlock.ts'
import IcpLedgerCanister_TimestampSchema from '$/schema/IcpLedgerCanister_Timestamp.ts'
import IcpLedgerCanisterSchema from '$/schema/IcpLedgerCanister.ts'
import IcpLedgerTransactionSchema from '$/schema/IcpLedgerTransaction.ts'
import IcpNetwork_TimestampSchema from '$/schema/IcpNetwork_Timestamp.ts'
import IcpNetworkSchema from '$/schema/IcpNetwork.ts'
import IcpRequestStatus_TimestampSchema from '$/schema/IcpRequestStatus_Timestamp.ts'
import IcpRequestStatusSchema from '$/schema/IcpRequestStatus.ts'
import IcpSubnet_TimestampSchema from '$/schema/IcpSubnet_Timestamp.ts'
import IcpSubnetSchema from '$/schema/IcpSubnet.ts'
import IcpSubnetCanisterRange_TimestampSchema from '$/schema/IcpSubnetCanisterRange_Timestamp.ts'
import IpfsProtocolSchema from '$/schema/IpfsProtocol.ts'
import IpfsResourceSchema from '$/schema/IpfsResource.ts'
import IssuerActionSchema from '$/schema/IssuerAction.ts'
import IssuerPowerSchema from '$/schema/IssuerPower.ts'
import KaspaAcceptedTransactionSchema from '$/schema/KaspaAcceptedTransaction.ts'
import KaspaAddress_TimestampSchema from '$/schema/KaspaAddress_Timestamp.ts'
import KaspaAddressSchema from '$/schema/KaspaAddress.ts'
import KaspaAddressUtxo_TimestampSchema from '$/schema/KaspaAddressUtxo_Timestamp.ts'
import KaspaBlockSchema from '$/schema/KaspaBlock.ts'
import KaspaNetwork_TimestampSchema from '$/schema/KaspaNetwork_Timestamp.ts'
import KaspaNetworkSchema from '$/schema/KaspaNetwork.ts'
import KaspaTransactionSchema from '$/schema/KaspaTransaction.ts'
import KaspaVirtualChain_TimestampSchema from '$/schema/KaspaVirtualChain_Timestamp.ts'
import LensAccount_TimestampSchema from '$/schema/LensAccount_Timestamp.ts'
import LensAccountSchema from '$/schema/LensAccount.ts'
import LensAccountManagerSchema from '$/schema/LensAccountManager.ts'
import LensFeedSchema from '$/schema/LensFeed.ts'
import LensNetworkSchema from '$/schema/LensNetwork.ts'
import LensPost_TimestampSchema from '$/schema/LensPost_Timestamp.ts'
import LensPostSchema from '$/schema/LensPost.ts'
import LensUsernameSchema from '$/schema/LensUsername.ts'
import LensUsernameNamespaceSchema from '$/schema/LensUsernameNamespace.ts'
import LeverageSchema from '$/schema/Leverage.ts'
import LightningChannel_TimestampSchema from '$/schema/LightningChannel_Timestamp.ts'
import LightningChannelSchema from '$/schema/LightningChannel.ts'
import LightningNetwork_TimestampSchema from '$/schema/LightningNetwork_Timestamp.ts'
import LightningNetworkSchema from '$/schema/LightningNetwork.ts'
import LightningNode_TimestampSchema from '$/schema/LightningNode_Timestamp.ts'
import LightningNodeSchema from '$/schema/LightningNode.ts'
import LiquidityPool_BlockSchema from '$/schema/LiquidityPool_Block.ts'
import LiquidityPool_TimestampSchema from '$/schema/LiquidityPool_Timestamp.ts'
import LiquidityPoolSchema from '$/schema/LiquidityPool.ts'
import LitecoinMwebBlockSchema from '$/schema/LitecoinMwebBlock.ts'
import LitecoinMwebOutputSchema from '$/schema/LitecoinMwebOutput.ts'
import LitecoinMwebPegInSchema from '$/schema/LitecoinMwebPegIn.ts'
import LitecoinMwebPegOutSchema from '$/schema/LitecoinMwebPegOut.ts'
import LitecoinMwebTransactionSchema from '$/schema/LitecoinMwebTransaction.ts'
import LogosBlockchainNetwork_TimestampSchema from '$/schema/LogosBlockchainNetwork_Timestamp.ts'
import LogosBlockchainNetworkSchema from '$/schema/LogosBlockchainNetwork.ts'
import MagnetLinkSchema from '$/schema/MagnetLink.ts'
import MagnetResolution_TimestampSchema from '$/schema/MagnetResolution_Timestamp.ts'
import Market_Derivative_TimestampSchema from '$/schema/Market_Derivative_Timestamp.ts'
import Market_TimeInterval_TimestampSchema from '$/schema/Market_TimeInterval_Timestamp.ts'
import Market_TimestampSchema from '$/schema/Market_Timestamp.ts'
import MarketSchema from '$/schema/Market.ts'
import MarketAssetSchema from '$/schema/MarketAsset.ts'
import MarketPriceSchema from '$/schema/MarketPrice.ts'
import MarketVenueSchema from '$/schema/MarketVenue.ts'
import McpPromptSchema from '$/schema/McpPrompt.ts'
import McpPromptResultSchema from '$/schema/McpPromptResult.ts'
import McpResourceSchema from '$/schema/McpResource.ts'
import McpResourceContent_TimestampSchema from '$/schema/McpResourceContent_Timestamp.ts'
import McpResourceTemplateSchema from '$/schema/McpResourceTemplate.ts'
import McpServer_TimestampSchema from '$/schema/McpServer_Timestamp.ts'
import McpServerSchema from '$/schema/McpServer.ts'
import McpServerPackageSchema from '$/schema/McpServerPackage.ts'
import McpServerPackageVersionSchema from '$/schema/McpServerPackageVersion.ts'
import McpToolSchema from '$/schema/McpTool.ts'
import McpToolCall_TimestampSchema from '$/schema/McpToolCall_Timestamp.ts'
import McpToolCallSchema from '$/schema/McpToolCall.ts'
import MediaSchema from '$/schema/Media.ts'
import MevBuilder_TimestampSchema from '$/schema/MevBuilder_Timestamp.ts'
import MevBuilderSchema from '$/schema/MevBuilder.ts'
import MevRelay_ProposerPayloadDeliveredSchema from '$/schema/MevRelay_ProposerPayloadDelivered.ts'
import MevRelay_TimestampSchema from '$/schema/MevRelay_Timestamp.ts'
import MevRelaySchema from '$/schema/MevRelay.ts'
import MoneroBlockSchema from '$/schema/MoneroBlock.ts'
import MoneroKeyImageSchema from '$/schema/MoneroKeyImage.ts'
import MoneroNetwork_TimestampSchema from '$/schema/MoneroNetwork_Timestamp.ts'
import MoneroNetworkSchema from '$/schema/MoneroNetwork.ts'
import MoneroRingSchema from '$/schema/MoneroRing.ts'
import MoneroRingMemberSchema from '$/schema/MoneroRingMember.ts'
import MoneroStealthOutputSchema from '$/schema/MoneroStealthOutput.ts'
import MoneroTransactionSchema from '$/schema/MoneroTransaction.ts'
import MoveFunctionSchema from '$/schema/MoveFunction.ts'
import MoveModule_TimestampSchema from '$/schema/MoveModule_Timestamp.ts'
import MoveModuleSchema from '$/schema/MoveModule.ts'
import MoveStructSchema from '$/schema/MoveStruct.ts'
import NearAccessKey_TimestampSchema from '$/schema/NearAccessKey_Timestamp.ts'
import NearAccessKeySchema from '$/schema/NearAccessKey.ts'
import NearAccount_TimestampSchema from '$/schema/NearAccount_Timestamp.ts'
import NearAccountSchema from '$/schema/NearAccount.ts'
import NearActionSchema from '$/schema/NearAction.ts'
import NearBlockSchema from '$/schema/NearBlock.ts'
import NearChunkSchema from '$/schema/NearChunk.ts'
import NearContract_TimestampSchema from '$/schema/NearContract_Timestamp.ts'
import NearContractSchema from '$/schema/NearContract.ts'
import NearContractStorageEntrySchema from '$/schema/NearContractStorageEntry.ts'
import NearExecutionOutcomeSchema from '$/schema/NearExecutionOutcome.ts'
import NearNetwork_TimestampSchema from '$/schema/NearNetwork_Timestamp.ts'
import NearNetworkSchema from '$/schema/NearNetwork.ts'
import NearReceiptSchema from '$/schema/NearReceipt.ts'
import NearTransactionSchema from '$/schema/NearTransaction.ts'
import NearValidator_TimestampSchema from '$/schema/NearValidator_Timestamp.ts'
import NearValidatorSchema from '$/schema/NearValidator.ts'
import Network_Activity_DaySchema from '$/schema/Network_Activity_Day.ts'
import Network_TimestampSchema from '$/schema/Network_Timestamp.ts'
import NetworkSchema from '$/schema/Network.ts'
import NetworkEndpointObservation_TimestampSchema from '$/schema/NetworkEndpointObservation_Timestamp.ts'
import NetworkStackSchema from '$/schema/NetworkStack.ts'
import NetworkUpgrade_TimestampSchema from '$/schema/NetworkUpgrade_Timestamp.ts'
import NetworkUpgradeSchema from '$/schema/NetworkUpgrade.ts'
import NftCollectionSchema from '$/schema/NftCollection.ts'
import NftTokenSchema from '$/schema/NftToken.ts'
import NostrArticleSchema from '$/schema/NostrArticle.ts'
import NostrArticleEventSchema from '$/schema/NostrArticleEvent.ts'
import NostrNetworkSchema from '$/schema/NostrNetwork.ts'
import NostrNoteSchema from '$/schema/NostrNote.ts'
import NostrProfileSchema from '$/schema/NostrProfile.ts'
import NostrProfileMetadataEventSchema from '$/schema/NostrProfileMetadataEvent.ts'
import NostrReactionSchema from '$/schema/NostrReaction.ts'
import NostrRelay_TimestampSchema from '$/schema/NostrRelay_Timestamp.ts'
import NostrRelaySchema from '$/schema/NostrRelay.ts'
import NostrRepostSchema from '$/schema/NostrRepost.ts'
import NostrSearchQuerySchema from '$/schema/NostrSearchQuery.ts'
import OracleFeed_RoundSchema from '$/schema/OracleFeed_Round.ts'
import OracleFeed_TimestampSchema from '$/schema/OracleFeed_Timestamp.ts'
import OracleFeedSchema from '$/schema/OracleFeed.ts'
import PayjoinDirectorySchema from '$/schema/PayjoinDirectory.ts'
import PayjoinEndpoint_TimestampSchema from '$/schema/PayjoinEndpoint_Timestamp.ts'
import PayjoinEndpointSchema from '$/schema/PayjoinEndpoint.ts'
import PayoutSchema from '$/schema/Payout.ts'
import PayoutClaim_TimestampSchema from '$/schema/PayoutClaim_Timestamp.ts'
import PolkadotAccount_TimestampSchema from '$/schema/PolkadotAccount_Timestamp.ts'
import PolkadotAccountSchema from '$/schema/PolkadotAccount.ts'
import PolkadotAsset_TimestampSchema from '$/schema/PolkadotAsset_Timestamp.ts'
import PolkadotAssetSchema from '$/schema/PolkadotAsset.ts'
import PolkadotAssetBalance_TimestampSchema from '$/schema/PolkadotAssetBalance_Timestamp.ts'
import PolkadotBlockSchema from '$/schema/PolkadotBlock.ts'
import PolkadotEventSchema from '$/schema/PolkadotEvent.ts'
import PolkadotExtrinsicSchema from '$/schema/PolkadotExtrinsic.ts'
import PolkadotPalletSchema from '$/schema/PolkadotPallet.ts'
import PolkadotReferendum_TimestampSchema from '$/schema/PolkadotReferendum_Timestamp.ts'
import PolkadotReferendumSchema from '$/schema/PolkadotReferendum.ts'
import PolkadotValidator_EraSchema from '$/schema/PolkadotValidator_Era.ts'
import PolkadotValidatorSchema from '$/schema/PolkadotValidator.ts'
import PythPriceFeed_TimestampSchema from '$/schema/PythPriceFeed_Timestamp.ts'
import PythPriceFeedSchema from '$/schema/PythPriceFeed.ts'
import QuilibriumAccountSchema from '$/schema/QuilibriumAccount.ts'
import QuilibriumFrameSchema from '$/schema/QuilibriumFrame.ts'
import QuilibriumProverSchema from '$/schema/QuilibriumProver.ts'
import QuilibriumShardSchema from '$/schema/QuilibriumShard.ts'
import RadicleCollaborationEventSchema from '$/schema/RadicleCollaborationEvent.ts'
import RadicleDelegateSchema from '$/schema/RadicleDelegate.ts'
import RadicleDiscussionCommentSchema from '$/schema/RadicleDiscussionComment.ts'
import RadicleIdentityDocumentSchema from '$/schema/RadicleIdentityDocument.ts'
import RadicleIdentityRevisionSchema from '$/schema/RadicleIdentityRevision.ts'
import RadicleIssueSchema from '$/schema/RadicleIssue.ts'
import RadiclePatchSchema from '$/schema/RadiclePatch.ts'
import RadicleRepositorySchema from '$/schema/RadicleRepository.ts'
import RadicleSignedRef_TimestampSchema from '$/schema/RadicleSignedRef_Timestamp.ts'
import RadicleSignedRefSchema from '$/schema/RadicleSignedRef.ts'
import RedditComment_TimestampSchema from '$/schema/RedditComment_Timestamp.ts'
import RedditCommentSchema from '$/schema/RedditComment.ts'
import RedditLink_TimestampSchema from '$/schema/RedditLink_Timestamp.ts'
import RedditLinkSchema from '$/schema/RedditLink.ts'
import RedditNetworkSchema from '$/schema/RedditNetwork.ts'
import RedditSubreddit_TimestampSchema from '$/schema/RedditSubreddit_Timestamp.ts'
import RedditSubredditSchema from '$/schema/RedditSubreddit.ts'
import RegulatedAssetProfile_TimestampSchema from '$/schema/RegulatedAssetProfile_Timestamp.ts'
import RegulatedAssetProfileSchema from '$/schema/RegulatedAssetProfile.ts'
import RoyaltyRight_TimestampSchema from '$/schema/RoyaltyRight_Timestamp.ts'
import RssFeed_TimestampSchema from '$/schema/RssFeed_Timestamp.ts'
import RssFeedSchema from '$/schema/RssFeed.ts'
import RssItem_TimestampSchema from '$/schema/RssItem_Timestamp.ts'
import RssItemSchema from '$/schema/RssItem.ts'
import RssNetworkSchema from '$/schema/RssNetwork.ts'
import ScalingDeploymentClaim_TimestampSchema from '$/schema/ScalingDeploymentClaim_Timestamp.ts'
import ScalingDeploymentClaimSchema from '$/schema/ScalingDeploymentClaim.ts'
import SolanaAccount_TimestampSchema from '$/schema/SolanaAccount_Timestamp.ts'
import SolanaAccountSchema from '$/schema/SolanaAccount.ts'
import SolanaBlockSchema from '$/schema/SolanaBlock.ts'
import SolanaInstructionSchema from '$/schema/SolanaInstruction.ts'
import SolanaProgramSchema from '$/schema/SolanaProgram.ts'
import SolanaTokenAccount_TimestampSchema from '$/schema/SolanaTokenAccount_Timestamp.ts'
import SolanaTokenAccountSchema from '$/schema/SolanaTokenAccount.ts'
import SolanaTokenMint_TimestampSchema from '$/schema/SolanaTokenMint_Timestamp.ts'
import SolanaTokenMintSchema from '$/schema/SolanaTokenMint.ts'
import SolanaTransaction_TimestampSchema from '$/schema/SolanaTransaction_Timestamp.ts'
import SolanaTransactionSchema from '$/schema/SolanaTransaction.ts'
import SolanaValidator_TimestampSchema from '$/schema/SolanaValidator_Timestamp.ts'
import SolanaValidatorSchema from '$/schema/SolanaValidator.ts'
import SorobanContract_TimestampSchema from '$/schema/SorobanContract_Timestamp.ts'
import SorobanContractSchema from '$/schema/SorobanContract.ts'
import SorobanContractStorageEntry_TimestampSchema from '$/schema/SorobanContractStorageEntry_Timestamp.ts'
import SorobanContractStorageEntrySchema from '$/schema/SorobanContractStorageEntry.ts'
import SorobanWasm_TimestampSchema from '$/schema/SorobanWasm_Timestamp.ts'
import SorobanWasmSchema from '$/schema/SorobanWasm.ts'
import SpecificationProposalSchema from '$/schema/SpecificationProposal.ts'
import SpecificationProposalKindSchema from '$/schema/SpecificationProposalKind.ts'
import SpecificationRealmSchema from '$/schema/SpecificationRealm.ts'
import StarknetAccount_TimestampSchema from '$/schema/StarknetAccount_Timestamp.ts'
import StarknetBlockSchema from '$/schema/StarknetBlock.ts'
import StarknetClassSchema from '$/schema/StarknetClass.ts'
import StarknetContractSchema from '$/schema/StarknetContract.ts'
import StarknetEventSchema from '$/schema/StarknetEvent.ts'
import StarknetNetwork_TimestampSchema from '$/schema/StarknetNetwork_Timestamp.ts'
import StarknetNetworkSchema from '$/schema/StarknetNetwork.ts'
import StarknetStorageEntry_TimestampSchema from '$/schema/StarknetStorageEntry_Timestamp.ts'
import StarknetStorageEntrySchema from '$/schema/StarknetStorageEntry.ts'
import StarknetTransaction_TimestampSchema from '$/schema/StarknetTransaction_Timestamp.ts'
import StarknetTransactionSchema from '$/schema/StarknetTransaction.ts'
import StellarAccount_TimestampSchema from '$/schema/StellarAccount_Timestamp.ts'
import StellarAccountSchema from '$/schema/StellarAccount.ts'
import StellarAccountSigner_TimestampSchema from '$/schema/StellarAccountSigner_Timestamp.ts'
import StellarAccountSignerSchema from '$/schema/StellarAccountSigner.ts'
import StellarAssetSchema from '$/schema/StellarAsset.ts'
import StellarClaimableBalance_TimestampSchema from '$/schema/StellarClaimableBalance_Timestamp.ts'
import StellarClaimableBalanceSchema from '$/schema/StellarClaimableBalance.ts'
import StellarLedgerSchema from '$/schema/StellarLedger.ts'
import StellarLiquidityPool_TimestampSchema from '$/schema/StellarLiquidityPool_Timestamp.ts'
import StellarLiquidityPoolSchema from '$/schema/StellarLiquidityPool.ts'
import StellarNetwork_TimestampSchema from '$/schema/StellarNetwork_Timestamp.ts'
import StellarNetworkSchema from '$/schema/StellarNetwork.ts'
import StellarOffer_TimestampSchema from '$/schema/StellarOffer_Timestamp.ts'
import StellarOfferSchema from '$/schema/StellarOffer.ts'
import StellarOperationSchema from '$/schema/StellarOperation.ts'
import StellarTradeSchema from '$/schema/StellarTrade.ts'
import StellarTransaction_TimestampSchema from '$/schema/StellarTransaction_Timestamp.ts'
import StellarTransactionSchema from '$/schema/StellarTransaction.ts'
import StellarTrustline_TimestampSchema from '$/schema/StellarTrustline_Timestamp.ts'
import StellarTrustlineSchema from '$/schema/StellarTrustline.ts'
import SuiAccountSchema from '$/schema/SuiAccount.ts'
import SuiBalanceChangeSchema from '$/schema/SuiBalanceChange.ts'
import SuiCheckpointSchema from '$/schema/SuiCheckpoint.ts'
import SuiCoinBalance_TimestampSchema from '$/schema/SuiCoinBalance_Timestamp.ts'
import SuiCoinTypeSchema from '$/schema/SuiCoinType.ts'
import SuiDynamicFieldEdge_TimestampSchema from '$/schema/SuiDynamicFieldEdge_Timestamp.ts'
import SuiDynamicFieldEdgeSchema from '$/schema/SuiDynamicFieldEdge.ts'
import SuiEventSchema from '$/schema/SuiEvent.ts'
import SuiNetwork_TimestampSchema from '$/schema/SuiNetwork_Timestamp.ts'
import SuiNetworkSchema from '$/schema/SuiNetwork.ts'
import SuiObjectSchema from '$/schema/SuiObject.ts'
import SuiObjectChangeSchema from '$/schema/SuiObjectChange.ts'
import SuiObjectVersionSchema from '$/schema/SuiObjectVersion.ts'
import SuiPackageSchema from '$/schema/SuiPackage.ts'
import SuiPackageUpgradeSchema from '$/schema/SuiPackageUpgrade.ts'
import SuiPackageVersionSchema from '$/schema/SuiPackageVersion.ts'
import SuiProgrammableTransactionCommandSchema from '$/schema/SuiProgrammableTransactionCommand.ts'
import SuiRegulatedCoinState_TimestampSchema from '$/schema/SuiRegulatedCoinState_Timestamp.ts'
import SuiTransaction_TimestampSchema from '$/schema/SuiTransaction_Timestamp.ts'
import SuiTransactionSchema from '$/schema/SuiTransaction.ts'
import SwapQuote_TimestampSchema from '$/schema/SwapQuote_Timestamp.ts'
import SwapQuoteStepSchema from '$/schema/SwapQuoteStep.ts'
import SwarmProtocolSchema from '$/schema/SwarmProtocol.ts'
import SwarmResourceSchema from '$/schema/SwarmResource.ts'
import TezosAccount_TimestampSchema from '$/schema/TezosAccount_Timestamp.ts'
import TezosAccountSchema from '$/schema/TezosAccount.ts'
import TezosBaker_Cycle_TimestampSchema from '$/schema/TezosBaker_Cycle_Timestamp.ts'
import TezosBaker_TimestampSchema from '$/schema/TezosBaker_Timestamp.ts'
import TezosBakerSchema from '$/schema/TezosBaker.ts'
import TezosBakingRight_TimestampSchema from '$/schema/TezosBakingRight_Timestamp.ts'
import TezosBakingRightSchema from '$/schema/TezosBakingRight.ts'
import TezosBigMap_TimestampSchema from '$/schema/TezosBigMap_Timestamp.ts'
import TezosBigMapSchema from '$/schema/TezosBigMap.ts'
import TezosBigMapDiffSchema from '$/schema/TezosBigMapDiff.ts'
import TezosBigMapKey_TimestampSchema from '$/schema/TezosBigMapKey_Timestamp.ts'
import TezosBigMapKeySchema from '$/schema/TezosBigMapKey.ts'
import TezosBlockSchema from '$/schema/TezosBlock.ts'
import TezosContract_TimestampSchema from '$/schema/TezosContract_Timestamp.ts'
import TezosContractSchema from '$/schema/TezosContract.ts'
import TezosCycleSchema from '$/schema/TezosCycle.ts'
import TezosEntrypointSchema from '$/schema/TezosEntrypoint.ts'
import TezosInternalOperationSchema from '$/schema/TezosInternalOperation.ts'
import TezosMichelsonScriptSchema from '$/schema/TezosMichelsonScript.ts'
import TezosNetwork_TimestampSchema from '$/schema/TezosNetwork_Timestamp.ts'
import TezosNetworkSchema from '$/schema/TezosNetwork.ts'
import TezosOperationSchema from '$/schema/TezosOperation.ts'
import TezosOperationGroupSchema from '$/schema/TezosOperationGroup.ts'
import TezosToken_TimestampSchema from '$/schema/TezosToken_Timestamp.ts'
import TezosTokenSchema from '$/schema/TezosToken.ts'
import TezosTokenBalance_TimestampSchema from '$/schema/TezosTokenBalance_Timestamp.ts'
import TezosTokenTransferSchema from '$/schema/TezosTokenTransfer.ts'
import TokenMetadataDocumentSchema from '$/schema/TokenMetadataDocument.ts'
import TokenProgramExtension_TimestampSchema from '$/schema/TokenProgramExtension_Timestamp.ts'
import TonAccount_TimestampSchema from '$/schema/TonAccount_Timestamp.ts'
import TonAccountSchema from '$/schema/TonAccount.ts'
import TonBlockSchema from '$/schema/TonBlock.ts'
import TonContract_TimestampSchema from '$/schema/TonContract_Timestamp.ts'
import TonContractSchema from '$/schema/TonContract.ts'
import TonContractGetMethod_TimestampSchema from '$/schema/TonContractGetMethod_Timestamp.ts'
import TonContractGetMethodSchema from '$/schema/TonContractGetMethod.ts'
import TonJetton_TimestampSchema from '$/schema/TonJetton_Timestamp.ts'
import TonJettonSchema from '$/schema/TonJetton.ts'
import TonJettonBalance_TimestampSchema from '$/schema/TonJettonBalance_Timestamp.ts'
import TonJettonTransferSchema from '$/schema/TonJettonTransfer.ts'
import TonMessageSchema from '$/schema/TonMessage.ts'
import TonNetwork_TimestampSchema from '$/schema/TonNetwork_Timestamp.ts'
import TonNftCollection_TimestampSchema from '$/schema/TonNftCollection_Timestamp.ts'
import TonNftCollectionSchema from '$/schema/TonNftCollection.ts'
import TonNftItem_TimestampSchema from '$/schema/TonNftItem_Timestamp.ts'
import TonNftItemSchema from '$/schema/TonNftItem.ts'
import TonNftTransferSchema from '$/schema/TonNftTransfer.ts'
import TonShard_TimestampSchema from '$/schema/TonShard_Timestamp.ts'
import TonTrace_TimestampSchema from '$/schema/TonTrace_Timestamp.ts'
import TonTraceSchema from '$/schema/TonTrace.ts'
import TonTransactionSchema from '$/schema/TonTransaction.ts'
import TonTransactionPhaseSchema from '$/schema/TonTransactionPhase.ts'
import TonWorkchainSchema from '$/schema/TonWorkchain.ts'
import TransferRestrictionSchema from '$/schema/TransferRestriction.ts'
import TransferRestrictionCheck_TimestampSchema from '$/schema/TransferRestrictionCheck_Timestamp.ts'
import TronAccount_TimestampSchema from '$/schema/TronAccount_Timestamp.ts'
import TronAccountSchema from '$/schema/TronAccount.ts'
import TronAccountTokenBalance_TimestampSchema from '$/schema/TronAccountTokenBalance_Timestamp.ts'
import TronBlockSchema from '$/schema/TronBlock.ts'
import TronContract_TimestampSchema from '$/schema/TronContract_Timestamp.ts'
import TronContractSchema from '$/schema/TronContract.ts'
import TronNetwork_TimestampSchema from '$/schema/TronNetwork_Timestamp.ts'
import TronToken_TimestampSchema from '$/schema/TronToken_Timestamp.ts'
import TronTokenSchema from '$/schema/TronToken.ts'
import TronTokenTransferSchema from '$/schema/TronTokenTransfer.ts'
import TronTransactionSchema from '$/schema/TronTransaction.ts'
import TronTransactionReceiptSchema from '$/schema/TronTransactionReceipt.ts'
import TronWitness_TimestampSchema from '$/schema/TronWitness_Timestamp.ts'
import TronWitnessSchema from '$/schema/TronWitness.ts'
import TrustedIssuerSchema from '$/schema/TrustedIssuer.ts'
import UniswapV3Pool_BlockSchema from '$/schema/UniswapV3Pool_Block.ts'
import UniswapV3PoolSchema from '$/schema/UniswapV3Pool.ts'
import UniswapV3Position_BlockSchema from '$/schema/UniswapV3Position_Block.ts'
import UniswapV3PositionSchema from '$/schema/UniswapV3Position.ts'
import UrlSchema from '$/schema/Url.ts'
import UrlPreview_TimestampSchema from '$/schema/UrlPreview_Timestamp.ts'
import UsageRight_TimestampSchema from '$/schema/UsageRight_Timestamp.ts'
import UtxoAddress_TimestampSchema from '$/schema/UtxoAddress_Timestamp.ts'
import UtxoAddressSchema from '$/schema/UtxoAddress.ts'
import UtxoBlockSchema from '$/schema/UtxoBlock.ts'
import UtxoInputSchema from '$/schema/UtxoInput.ts'
import UtxoOutputSchema from '$/schema/UtxoOutput.ts'
import UtxoTransactionSchema from '$/schema/UtxoTransaction.ts'
import WalletConnectionMethodSchema from '$/schema/WalletConnectionMethod.ts'
import XmtpConversationSchema from '$/schema/XmtpConversation.ts'
import XmtpNetworkSchema from '$/schema/XmtpNetwork.ts'
import XNetworkSchema from '$/schema/XNetwork.ts'
import XPost_TimestampSchema from '$/schema/XPost_Timestamp.ts'
import XPostSchema from '$/schema/XPost.ts'
import XrplAccount_TimestampSchema from '$/schema/XrplAccount_Timestamp.ts'
import XrplAccountSchema from '$/schema/XrplAccount.ts'
import XrplAmendment_TimestampSchema from '$/schema/XrplAmendment_Timestamp.ts'
import XrplAmendmentSchema from '$/schema/XrplAmendment.ts'
import XrplAmm_TimestampSchema from '$/schema/XrplAmm_Timestamp.ts'
import XrplAmmSchema from '$/schema/XrplAmm.ts'
import XrplLedgerSchema from '$/schema/XrplLedger.ts'
import XrplLedgerEntrySchema from '$/schema/XrplLedgerEntry.ts'
import XrplTransaction_TimestampSchema from '$/schema/XrplTransaction_Timestamp.ts'
import XrplTransactionSchema from '$/schema/XrplTransaction.ts'
import XrplTrustline_TimestampSchema from '$/schema/XrplTrustline_Timestamp.ts'
import XrplTrustlineSchema from '$/schema/XrplTrustline.ts'
import XUser_TimestampSchema from '$/schema/XUser_Timestamp.ts'
import XUserSchema from '$/schema/XUser.ts'
import YoutubeChannel_TimestampSchema from '$/schema/YoutubeChannel_Timestamp.ts'
import YoutubeChannelSchema from '$/schema/YoutubeChannel.ts'
import YoutubeComment_TimestampSchema from '$/schema/YoutubeComment_Timestamp.ts'
import YoutubeCommentSchema from '$/schema/YoutubeComment.ts'
import YoutubeNetworkSchema from '$/schema/YoutubeNetwork.ts'
import YoutubePlaylist_TimestampSchema from '$/schema/YoutubePlaylist_Timestamp.ts'
import YoutubePlaylistSchema from '$/schema/YoutubePlaylist.ts'
import YoutubeVideo_TimestampSchema from '$/schema/YoutubeVideo_Timestamp.ts'
import YoutubeVideoSchema from '$/schema/YoutubeVideo.ts'
import ZcashShieldedActionSchema from '$/schema/ZcashShieldedAction.ts'
import ZcashShieldedPoolSchema from '$/schema/ZcashShieldedPool.ts'
import ZcashShieldedPoolBlockStateSchema from '$/schema/ZcashShieldedPoolBlockState.ts'
import ZeroGConsensusNetwork_TimestampSchema from '$/schema/ZeroGConsensusNetwork_Timestamp.ts'
import ZeroGConsensusNetworkSchema from '$/schema/ZeroGConsensusNetwork.ts'
import ZeroGDaNodeSchema from '$/schema/ZeroGDaNode.ts'
import ZeroGDaQuorumSchema from '$/schema/ZeroGDaQuorum.ts'
import ZeroGDataBlobSchema from '$/schema/ZeroGDataBlob.ts'
import ZeroGDataChunkSchema from '$/schema/ZeroGDataChunk.ts'
import ZeroGKvEntrySchema from '$/schema/ZeroGKvEntry.ts'
import ZeroGNetwork_TimestampSchema from '$/schema/ZeroGNetwork_Timestamp.ts'
import ZeroGNetworkSchema from '$/schema/ZeroGNetwork.ts'
import ZeroGServiceProviderSchema from '$/schema/ZeroGServiceProvider.ts'
import ZeroGServiceRequestSchema from '$/schema/ZeroGServiceRequest.ts'
import ZeroGSettlementTraceSchema from '$/schema/ZeroGSettlementTrace.ts'
import ZeroGStorageLogEntrySchema from '$/schema/ZeroGStorageLogEntry.ts'
import ZeroGStorageNode_TimestampSchema from '$/schema/ZeroGStorageNode_Timestamp.ts'
import ZeroGStorageNodeSchema from '$/schema/ZeroGStorageNode.ts'
import ZeroGStorageProofSchema from '$/schema/ZeroGStorageProof.ts'

const schemaChunk0 = [
	_GlobalSchema,
	_GlobalActivityPubNetworkSchema,
	_GlobalActivityPubNetwork_TimestampSchema,
	_GlobalAgentNetworkSchema,
	_GlobalAgentNetwork_TimestampSchema,
	_GlobalAiArtifactCatalogSchema,
	_GlobalAiArtifactCatalog_TimestampSchema,
	_GlobalAiModelCatalogSchema,
	_GlobalAiModelCatalog_TimestampSchema,
	_GlobalArweaveNetworkSchema,
	_GlobalAtprotoNetworkSchema,
	_GlobalAtprotoNetwork_TimestampSchema,
	_GlobalEnsNetworkSchema,
	_GlobalEnsNetwork_TimestampSchema,
	_GlobalEvmAbiCatalogSchema,
	_GlobalEvmAbiCatalog_TimestampSchema,
	_GlobalIpfsAccessSchema,
	_GlobalNostrNetworkSchema,
	_GlobalNostrNetwork_TimestampSchema,
	_GlobalRedditNetworkSchema,
	_GlobalRedditNetwork_TimestampSchema,
	_GlobalSwarmAccessSchema,
	_GlobalSwarmAccess_TimestampSchema,
	_GlobalXNetworkSchema,
	_GlobalYoutubeNetworkSchema,
	_GlobalYoutubeNetwork_TimestampSchema,
	A2aAgentCardSchema,
	A2aAgentCard_SnapshotSchema,
	A2aAgentInterfaceSchema,
	A2aAgentServiceSchema,
	A2aAgentService_TimestampSchema,
	A2aAgentSkillSchema,
	A2aArtifactSchema,
	A2aMessageSchema,
	A2aMessagePartSchema,
	A2aPushNotificationConfigSchema,
	A2aTaskSchema,
	A2aTask_TimestampSchema,
	A2aTaskEventSchema,
	AccountSchema,
	AcpAgentProgramSchema,
	AcpAgentProgramVersionSchema,
	AcpAgentRuntimeSchema,
	AcpAgentRuntime_TimestampSchema,
	AcpFileOperationSchema,
	AcpMessageSchema,
	AcpMessagePartSchema,
	AcpPermissionRequestSchema,
	AcpPromptTurnSchema,
	AcpSessionSchema,
] as const

const schemaChunk1 = [
	AcpSessionUpdateSchema,
	AcpTerminalSchema,
	AcpTerminal_TimestampSchema,
	AcpToolCallSchema,
	AcpToolCall_TimestampSchema,
	ActivityPubActorSchema,
	ActivityPubActor_TimestampSchema,
	ActivityPubInstanceSchema,
	ActivityPubInstance_TimestampSchema,
	ActivityPubInstanceModeratedDomainSchema,
	ActivityPubInstancePeerSchema,
	ActivityPubNetworkSchema,
	ActivityPubNoteSchema,
	ActivityPubNote_TimestampSchema,
	AgentIdentityClaimSchema,
	AgentPaymentRequirement_TimestampSchema,
	AiArtifactSchema,
	AiArtifactAttestationSchema,
	AiBenchmarkSchema,
	AiDatasetSchema,
	AiDocumentSchema,
	AiDocumentClaimSchema,
	AiEvaluation_TimestampSchema,
	AiModelSchema,
	AiModel_TimestampSchema,
	AiModelProviderSchema,
	AiModelVersionSchema,
	AiProviderApiOperationSchema,
	AiProviderApiOperation_TimestampSchema,
	AiProviderCatalogEntrySchema,
	AiProviderCatalogEntry_TimestampSchema,
	AiRelationshipClaimSchema,
	AlgorandAccountSchema,
	AlgorandAccount_TimestampSchema,
	AlgorandApplicationSchema,
	AlgorandApplication_TimestampSchema,
	AlgorandApplicationLocalState_RoundSchema,
	AlgorandAssetSchema,
	AlgorandAsset_TimestampSchema,
	AlgorandAssetHolding_RoundSchema,
	AlgorandBoxSchema,
	AlgorandBox_RoundSchema,
	AlgorandNetworkSchema,
	AlgorandNetwork_TimestampSchema,
	AlgorandRoundSchema,
	AlgorandTealProgramSchema,
	AlgorandTealProgram_TimestampSchema,
	AlgorandTransactionSchema,
	AlgorandTransactionGroupSchema,
	AlgorandTransactionProofSchema,
] as const

const schemaChunk2 = [
	AptosAccountSchema,
	AptosAccount_TimestampSchema,
	AptosAccountResourceSchema,
	AptosAccountResource_TimestampSchema,
	AptosBlockSchema,
	AptosCoinBalance_TimestampSchema,
	AptosEventSchema,
	AptosNetworkSchema,
	AptosNetwork_TimestampSchema,
	AptosStateChangeSchema,
	AptosTableItemSchema,
	AptosTableItem_TimestampSchema,
	AptosTransactionSchema,
	AptosTransaction_TimestampSchema,
	ArweaveBlockSchema,
	ArweaveNetworkSchema,
	ArweaveNetwork_TimestampSchema,
	ArweaveResourceSchema,
	ArweaveResource_TimestampSchema,
	ArweaveTransactionSchema,
	AssetClassSchema,
	AssetEligibilitySchema,
	AssetFormatSupport_TimestampSchema,
	AssetInstanceSchema,
	AssetObjectSchema,
	AssetSupply_LedgerCoordinateSchema,
	AssetSupply_TimestampSchema,
	AtprotoActorSchema,
	AtprotoActor_TimestampSchema,
	AtprotoNetworkSchema,
	AtprotoPostSchema,
	AtprotoPost_TimestampSchema,
	AtprotoRepoCommitSchema,
	AvailAppIdSchema,
	AvailAppId_TimestampSchema,
	AvailBlockSchema,
	AvailDataSubmissionSchema,
	AvailNetworkSchema,
	AvailNetwork_TimestampSchema,
	AvalancheBlockchainSchema,
	AvalancheDelegatorSchema,
	AvalanchePChainBlockSchema,
	AvalanchePChainTransactionSchema,
	AvalanchePChainTransaction_TimestampSchema,
	AvalancheSubnetSchema,
	AvalancheSubnet_TimestampSchema,
	AvalancheValidatorSchema,
	AvalancheValidator_TimestampSchema,
	BeaconAttestationSchema,
	BeaconCommitteeSchema,
] as const

const schemaChunk3 = [
	BeaconEpochSchema,
	BeaconSlashingSchema,
	BeaconSlotSchema,
	BeaconSyncCommitteeSchema,
	BeaconValidatorSchema,
	BeaconValidator_TimestampSchema,
	BeaconWithdrawalSchema,
	BitcoinCashBcmrMetadataSchema,
	BitcoinCashCashTokenCategorySchema,
	BitcoinCashCashTokenCommitmentSchema,
	BitcoinCashCashTokenFungibleAmountSchema,
	BitcoinCashCashTokenNftSchema,
	BittensorBlockSchema,
	BittensorMetagraph_TimestampSchema,
	BittensorNetworkSchema,
	BittensorNetwork_TimestampSchema,
	BittensorNeuronSchema,
	BittensorSubnetSchema,
	BitTorrentAnnounce_TimestampSchema,
	BitTorrentDhtLookup_TimestampSchema,
	BitTorrentDhtNode_TimestampSchema,
	BitTorrentFileSchema,
	BitTorrentFileTreeEntrySchema,
	BitTorrentMetainfoSchema,
	BitTorrentPeer_TimestampSchema,
	BitTorrentPieceSchema,
	BitTorrentSwarmObservation_TimestampSchema,
	BitTorrentTrackerSchema,
	BitTorrentTrackerScrape_TimestampSchema,
	BlockheadAccountSchema,
	BlockheadActionOutcomeSchema,
	BlockheadActionOutcome_TimestampSchema,
	BlockheadActionReadinessCheckSchema,
	BlockheadActionReadinessCheck_TimestampSchema,
	BlockheadAgentConnectionSchema,
	BlockheadAgentConnection_TimestampSchema,
	BlockheadAgentConversationSchema,
	BlockheadAgentConversationTurnSchema,
	BlockheadAgentCredentialStateSchema,
	BlockheadAgentCredentialState_TimestampSchema,
	BlockheadAgentProfileSchema,
	BlockheadAgentProgramInstallSchema,
	BlockheadAgentProgramInstall_TimestampSchema,
	BlockheadAgentProviderCallSchema,
	BlockheadAlgorandParticipationKeySchema,
	BlockheadAlgorandPendingTransactionSchema,
	BlockheadAvalancheNodeStateSchema,
	BlockheadAvalancheNodeState_TimestampSchema,
	BlockheadBitTorrentClientStateSchema,
	BlockheadBitTorrentClientState_TimestampSchema,
] as const

const schemaChunk4 = [
	BlockheadBitTorrentTransfer_TimestampSchema,
	BlockheadBridgeIntentSchema,
	BlockheadBridgeTransactionSchema,
	BlockheadCashuMeltQuoteSchema,
	BlockheadCashuMeltQuote_TimestampSchema,
	BlockheadCashuMintQuoteSchema,
	BlockheadCashuMintQuote_TimestampSchema,
	BlockheadCashuProofSchema,
	BlockheadCashuProof_TimestampSchema,
	BlockheadCashuTokenSchema,
	BlockheadCashuWalletStateSchema,
	BlockheadCashuWalletState_TimestampSchema,
	BlockheadCodexStorageNodeStateSchema,
	BlockheadCodexStorageNodeState_TimestampSchema,
	BlockheadCodexStoredDataSchema,
	BlockheadCodexStoredData_TimestampSchema,
	BlockheadEnsNameSearchSchema,
	BlockheadEvmWalletRequestSchema,
	BlockheadFarcasterAccountConnectionSchema,
	BlockheadFedimintClientStateSchema,
	BlockheadFedimintClientState_TimestampSchema,
	BlockheadFilecoinPendingMessageSchema,
	BlockheadIntentInvocationSchema,
	BlockheadIntentOrderSchema,
	BlockheadIntentOrder_TimestampSchema,
	BlockheadIntentQuoteSchema,
	BlockheadIntentQuote_TimestampSchema,
	BlockheadKaspaNodeStateSchema,
	BlockheadKaspaNodeState_TimestampSchema,
	BlockheadLightningChannelStateSchema,
	BlockheadLightningChannelState_TimestampSchema,
	BlockheadLightningHtlcSchema,
	BlockheadLightningInvoiceSchema,
	BlockheadLightningInvoice_TimestampSchema,
	BlockheadLightningNodeStateSchema,
	BlockheadLightningNodeState_TimestampSchema,
	BlockheadLightningPaymentSchema,
	BlockheadLightningPayment_TimestampSchema,
	BlockheadLitecoinMwebOutputStateSchema,
	BlockheadLitecoinMwebOutputState_TimestampSchema,
	BlockheadLitecoinMwebWalletStateSchema,
	BlockheadLitecoinMwebWalletState_TimestampSchema,
	BlockheadLocalMediaIngestSchema,
	BlockheadLocalMediaIngest_TimestampSchema,
	BlockheadLogosBlockchainNodeStateSchema,
	BlockheadLogosBlockchainNodeState_TimestampSchema,
	BlockheadLogosBlockchainWalletKeyStateSchema,
	BlockheadLogosBlockchainWalletKeyState_TimestampSchema,
	BlockheadMoneroOutputStateSchema,
	BlockheadMoneroOutputState_TimestampSchema,
] as const

const schemaChunk5 = [
	BlockheadMoneroSubaddressStateSchema,
	BlockheadMoneroSubaddressState_TimestampSchema,
	BlockheadMoneroTransferStateSchema,
	BlockheadMoneroTransferState_TimestampSchema,
	BlockheadMoneroWalletStateSchema,
	BlockheadMoneroWalletState_TimestampSchema,
	BlockheadPanelSchema,
	BlockheadPanelTreeSchema,
	BlockheadPayjoinSessionSchema,
	BlockheadQuilibriumAccountStateSchema,
	BlockheadQuilibriumAccountState_TimestampSchema,
	BlockheadQuilibriumNodeStateSchema,
	BlockheadQuilibriumNodeState_TimestampSchema,
	BlockheadQuilibriumPendingTransactionSchema,
	BlockheadRadicleNodeInventory_TimestampSchema,
	BlockheadRadicleNodeStateSchema,
	BlockheadRadicleNodeState_TimestampSchema,
	BlockheadRadiclePeerSchema,
	BlockheadRadicleSeedObservation_TimestampSchema,
	BlockheadRadicleSyncSessionSchema,
	BlockheadRoomSchema,
	BlockheadRoomPeerSchema,
	BlockheadSessionSchema,
	BlockheadSessionActionSchema,
	BlockheadSessionSimulationSchema,
	BlockheadSessionSimulationCallSchema,
	BlockheadSessionSimulationLogSchema,
	BlockheadSharedAddressSchema,
	BlockheadSiweChallengeSchema,
	BlockheadSocialPostSessionSchema,
	BlockheadSourceSchema,
	BlockheadSource_TimestampSchema,
	BlockheadStateChannelSchema,
	BlockheadStateChannel_TimestampSchema,
	BlockheadStateChannelDepositSchema,
	BlockheadStateChannelDeposit_TimestampSchema,
	BlockheadStateChannelStateSchema,
	BlockheadStateChannelTransferSchema,
	BlockheadSwapIntentSchema,
	BlockheadTransferIntentSchema,
	BlockheadTransferRequestSchema,
	BlockheadWakuMessageObservation_TimestampSchema,
	BlockheadWakuNodeStateSchema,
	BlockheadWakuNodeState_TimestampSchema,
	BlockheadWalletSchema,
	BlockheadWalletAuthenticationSchema,
	BlockheadWalletCapabilityGrantSchema,
	BlockheadWalletConnectionSchema,
	BlockheadWalletRequestSchema,
	BlockheadWalletRequest_TimestampSchema,
] as const

const schemaChunk6 = [
	BlockheadWalletRequestCallSchema,
	BlockheadWalletTransportSessionSchema,
	BlockheadWorkspaceSchema,
	BlockheadZcashNoteStateSchema,
	BlockheadZcashNoteState_TimestampSchema,
	BlockheadZcashViewingKeySchema,
	BlockheadZcashViewingKey_TimestampSchema,
	BlockheadZcashWalletStateSchema,
	BlockheadZcashWalletState_TimestampSchema,
	BlockheadZeroGStorageNodeStateSchema,
	BlockheadZeroGStorageNodeState_TimestampSchema,
	BlockheadZeroGStorageProofSchema,
	BlockheadZeroGStoredChunkSchema,
	BnbBeaconBlockSchema,
	BnbBeaconNetworkSchema,
	BnbBeaconNetwork_TimestampSchema,
	BnbBeaconTokenSchema,
	BnbBeaconToken_TimestampSchema,
	BnbBeaconTokenMigrationSchema,
	BnbBeaconTokenMigration_TimestampSchema,
	BnbBeaconTokenTransferSchema,
	BnbBeaconTransactionSchema,
	BnbValidatorSchema,
	BnbValidator_TimestampSchema,
	BridgeRouteSchema,
	BridgeRouteQuote_TimestampSchema,
	BridgeRouteQuoteStepSchema,
	BridgeRouteStepSchema,
	BridgeTransferSchema,
	BridgeTransfer_TimestampSchema,
	CardanoAddressSchema,
	CardanoAddress_TimestampSchema,
	CardanoBlockSchema,
	CardanoCertificateSchema,
	CardanoCommittee_EpochSchema,
	CardanoConstitution_EpochSchema,
	CardanoDRepSchema,
	CardanoDRep_TimestampSchema,
	CardanoGovernanceProposalSchema,
	CardanoGovernanceProposal_TimestampSchema,
	CardanoGovernanceVoteSchema,
	CardanoNativeAssetSchema,
	CardanoNativeAsset_TimestampSchema,
	CardanoNetwork_TimestampSchema,
	CardanoProtocolParameters_EpochSchema,
	CardanoScriptWitnessSchema,
	CardanoStakeCredentialSchema,
	CardanoStakeDelegation_EpochSchema,
	CardanoStakePoolSchema,
	CardanoStakePool_TimestampSchema,
] as const

const schemaChunk7 = [
	CardanoTransactionSchema,
	CardanoTxInputSchema,
	CardanoTxOutputSchema,
	CardanoTxOutputAssetSchema,
	CashuKeysetSchema,
	CashuKeyset_TimestampSchema,
	CashuMintSchema,
	CashuMint_TimestampSchema,
	CctpAllowanceSchema,
	CctpAttestation_TimestampSchema,
	CctpBurnFee_TimestampSchema,
	CctpDomainSupportSchema,
	CctpFastBurnAllowance_TimestampSchema,
	CctpFeeSchema,
	CctpMessageSchema,
	CelestiaBlobSchema,
	CelestiaBlockSchema,
	CelestiaNamespaceSchema,
	CelestiaNamespace_TimestampSchema,
	CelestiaNetworkSchema,
	CelestiaNetwork_TimestampSchema,
	ClaimTopicRequirementSchema,
	CodexDatasetSchema,
	CoinSchema,
	Coin_TimestampSchema,
	CoinBridgeCapabilitySchema,
	ComplianceModuleSchema,
	ContractInterfaceMemberSchema,
	CosmosAccountSchema,
	CosmosAccount_TimestampSchema,
	CosmosBlockSchema,
	CosmosContractSchema,
	CosmosDenomSchema,
	CosmosGovernanceProposalSchema,
	CosmosGovernanceProposal_TimestampSchema,
	CosmosMessageSchema,
	CosmosModuleSchema,
	CosmosTransactionSchema,
	CosmosValidatorSchema,
	CosmosValidator_TimestampSchema,
	CronosNetworkProfileSchema,
	CurrencySchema,
	Currency_TimestampSchema,
	DogecoinAuxPowMerkleBranchSchema,
	DogecoinAuxPowParentBlockHeaderSchema,
	DogecoinBlockAuxPowSchema,
	DydxChainMarketSchema,
	DydxChainMarket_TimestampSchema,
	DydxChainNetworkSchema,
	DydxChainNetwork_TimestampSchema,
] as const

const schemaChunk8 = [
	DydxChainOrderSchema,
	DydxChainOrder_TimestampSchema,
	DydxChainPerpetualPosition_TimestampSchema,
	DydxChainSubaccountSchema,
	DydxChainSubaccount_TimestampSchema,
	EasAttestationSchema,
	EasAttestation_TimestampSchema,
	EasSchemaSchema,
	EigenLayerAllocation_TimestampSchema,
	EigenLayerAvsSchema,
	EigenLayerAvs_TimestampSchema,
	EigenLayerDelegation_TimestampSchema,
	EigenLayerOperatorSchema,
	EigenLayerProtocolSchema,
	EigenLayerReward_TimestampSchema,
	EigenLayerSlashingEventSchema,
	EigenLayerStrategySchema,
	EigenLayerStrategy_TimestampSchema,
	Eip7702AuthorizationSchema,
	Eip8004AgentRegistrationSchema,
	Eip8004AgentRegistration_TimestampSchema,
	Eip8004AgentRegistrationFileSchema,
	Eip8004AgentServiceEndpointSchema,
	Eip8004CrossRegistrationSchema,
	Eip8004EndpointDomainVerification_TimestampSchema,
	Eip8004ReputationFeedback_TimestampSchema,
	Eip8004Validation_TimestampSchema,
	ElementsAssetSchema,
	ElementsAsset_TimestampSchema,
	ElementsIssuanceSchema,
	ElementsNetworkSchema,
	ElementsPegSchema,
	ElementsPeg_TimestampSchema,
	EnsNameSchema,
	EnsName_TimestampSchema,
	EnsRecordSchema,
	EnsRecord_TimestampSchema,
	EnsReverseRecordSchema,
	EnsReverseRecord_TimestampSchema,
	Erc4337AccountFactorySchema,
	Erc4337AccountFactory_TimestampSchema,
	Erc4337BundlerSchema,
	Erc4337Bundler_TimestampSchema,
	Erc4337PaymasterSchema,
	Erc4337Paymaster_TimestampSchema,
	Erc4337SmartAccountSchema,
	Erc4337SmartAccount_TimestampSchema,
	Erc4626VaultSchema,
	Erc4626Vault_BlockSchema,
	Erc4626Vault_TimestampSchema,
] as const

const schemaChunk9 = [
	EthereumBeaconFinality_TimestampSchema,
	EthereumConsensusUpgradeSchema,
	EthereumExecutionUpgradeSchema,
	EthereumNetworkUpgradeSchema,
	EvmAccountSchema,
	EvmActorCoinAllowanceSchema,
	EvmActorCoinAllowance_BlockSchema,
	EvmBlobSchema,
	EvmBlockSchema,
	EvmCalldataSchema,
	EvmCoinInstanceSchema,
	EvmContractSchema,
	EvmContractCompilationSchema,
	EvmContractSourceBundleSchema,
	EvmContractVerificationSchema,
	EvmErrorSchema,
	EvmError_TimestampSchema,
	EvmInternalTransferSchema,
	EvmLogSchema,
	EvmNetwork_GasEstimate_TimestampSchema,
	EvmNetwork_GasFee_BlockSchema,
	EvmNetwork_TimestampSchema,
	EvmNetwork_Txpool_TimestampSchema,
	EvmNetworkAccountSchema,
	EvmNetworkAccount_TimestampSchema,
	EvmNetworkActorCoinBalanceSchema,
	EvmNetworkActorCoinBalance_EvmBlockSchema,
	EvmNetworkActorCoinBalance_TimestampSchema,
	EvmNetworkBridgeSchema,
	EvmNftSchema,
	EvmProtocolSchema,
	EvmRollupSchema,
	EvmRollup_TimestampSchema,
	EvmSelectorSchema,
	EvmSelector_TimestampSchema,
	EvmStorageRead_TimestampSchema,
	EvmTokenTransferSchema,
	EvmTopicSchema,
	EvmTopic_TimestampSchema,
	EvmTraceSchema,
	EvmTransactionSchema,
	EvmUserOperationSchema,
	FarcasterCastSchema,
	FarcasterCast_TimestampSchema,
	FarcasterCastEmbedSchema,
	FarcasterChannelSchema,
	FarcasterChannel_TimestampSchema,
	FarcasterChannel_Viewer_TimestampSchema,
	FarcasterFeedSchema,
	FarcasterNetworkSchema,
] as const

const schemaChunk10 = [
	FarcasterUserSchema,
	FarcasterUser_TimestampSchema,
	FarcasterVerifiedAddressSchema,
	FedimintFederationSchema,
	FedimintFederation_TimestampSchema,
	FedimintGatewaySchema,
	FedimintGateway_TimestampSchema,
	FilecoinActorSchema,
	FilecoinActor_TimestampSchema,
	FilecoinBlockSchema,
	FilecoinDealSchema,
	FilecoinDeal_TimestampSchema,
	FilecoinMessageSchema,
	FilecoinMessageReceiptSchema,
	FilecoinMinerSchema,
	FilecoinMiner_TimestampSchema,
	FilecoinNetworkSchema,
	FilecoinNetwork_TimestampSchema,
	FilecoinSectorSchema,
	FilecoinSector_TimestampSchema,
	FilecoinTipsetSchema,
	GitBlobSchema,
	GitCommitSchema,
	GitFetchObservationSchema,
	GitForgeIssueSchema,
	GitForgeMirrorSchema,
	GitForgePullRequestSchema,
	GitForgeReleaseSchema,
	GitLooseObjectSchema,
	GitObjectSchema,
	GitObjectVerification_TimestampSchema,
	GitPackedObjectSchema,
	GitPackfileSchema,
	GitRefSchema,
	GitRefObservation_TimestampSchema,
	GitRefUpdateSchema,
	GitRemoteSchema,
	GitRepositorySchema,
	GitSignatureSchema,
	GitTagSchema,
	GitTreeSchema,
	GitTreeEntrySchema,
	GitTreePathResolutionSchema,
	HederaAccountSchema,
	HederaAccount_TimestampSchema,
	HederaAllowanceSchema,
	HederaAllowance_TimestampSchema,
	HederaBlockSchema,
	HederaContractSchema,
	HederaContract_TimestampSchema,
] as const

const schemaChunk11 = [
	HederaContractActionSchema,
	HederaContractLogSchema,
	HederaContractResultSchema,
	HederaContractState_TimestampSchema,
	HederaHbarTransferSchema,
	HederaNetwork_TimestampSchema,
	HederaNetworkExchangeRate_TimestampSchema,
	HederaNetworkFee_TimestampSchema,
	HederaNetworkStake_TimestampSchema,
	HederaNetworkSupply_TimestampSchema,
	HederaNftSchema,
	HederaNft_TimestampSchema,
	HederaNodeSchema,
	HederaNode_TimestampSchema,
	HederaScheduleSchema,
	HederaSchedule_TimestampSchema,
	HederaScheduleSignatureSchema,
	HederaTokenSchema,
	HederaToken_TimestampSchema,
	HederaTokenAssociationSchema,
	HederaTokenAssociation_TimestampSchema,
	HederaTokenCustomFeeSchema,
	HederaTokenTransferSchema,
	HederaTopicSchema,
	HederaTopic_TimestampSchema,
	HederaTopicMessageSchema,
	HederaTransactionSchema,
	HyperliquidAccountSchema,
	HyperliquidAccount_TimestampSchema,
	HyperliquidBlockSchema,
	HyperliquidFillSchema,
	HyperliquidMarket_TimeInterval_TimestampSchema,
	HyperliquidNetworkSchema,
	HyperliquidNetwork_TimestampSchema,
	HyperliquidOrderSchema,
	HyperliquidOrder_TimestampSchema,
	HyperliquidOrderbook_TimestampSchema,
	HyperliquidPerpMarketSchema,
	HyperliquidPerpMarket_TimestampSchema,
	HyperliquidSpotAssetSchema,
	HyperliquidSpotPairSchema,
	HyperliquidSpotPair_TimestampSchema,
	HyperliquidTransactionSchema,
	HyperliquidTransaction_TimestampSchema,
	HyperliquidValidatorSchema,
	HyperliquidValidator_TimestampSchema,
	HyperliquidVaultSchema,
	HyperliquidVault_TimestampSchema,
	HyperliquidVaultEquity_TimestampSchema,
	IbcChannelSchema,
] as const

const schemaChunk12 = [
	IbcClientSchema,
	IbcConnectionSchema,
	IbcDenomTraceSchema,
	IbcPacketSchema,
	IcpCanisterSchema,
	IcpCanister_TimestampSchema,
	IcpCanisterLog_TimestampSchema,
	IcpCanisterMetadataSchema,
	IcpCanisterMetadata_TimestampSchema,
	IcpCanisterMethodSchema,
	IcpCanisterMethod_TimestampSchema,
	IcpCertifiedStateSchema,
	IcpLedgerAccount_TimestampSchema,
	IcpLedgerBlockSchema,
	IcpLedgerCanisterSchema,
	IcpLedgerCanister_TimestampSchema,
	IcpLedgerTransactionSchema,
	IcpNetworkSchema,
	IcpNetwork_TimestampSchema,
	IcpRequestStatusSchema,
	IcpRequestStatus_TimestampSchema,
	IcpSubnetSchema,
	IcpSubnet_TimestampSchema,
	IcpSubnetCanisterRange_TimestampSchema,
	IpfsProtocolSchema,
	IpfsResourceSchema,
	IssuerActionSchema,
	IssuerPowerSchema,
	KaspaAcceptedTransactionSchema,
	KaspaAddressSchema,
	KaspaAddress_TimestampSchema,
	KaspaAddressUtxo_TimestampSchema,
	KaspaBlockSchema,
	KaspaNetworkSchema,
	KaspaNetwork_TimestampSchema,
	KaspaTransactionSchema,
	KaspaVirtualChain_TimestampSchema,
	LensAccountSchema,
	LensAccount_TimestampSchema,
	LensAccountManagerSchema,
	LensFeedSchema,
	LensNetworkSchema,
	LensPostSchema,
	LensPost_TimestampSchema,
	LensUsernameSchema,
	LensUsernameNamespaceSchema,
	LeverageSchema,
	LightningChannelSchema,
	LightningChannel_TimestampSchema,
	LightningNetworkSchema,
] as const

const schemaChunk13 = [
	LightningNetwork_TimestampSchema,
	LightningNodeSchema,
	LightningNode_TimestampSchema,
	LiquidityPoolSchema,
	LiquidityPool_BlockSchema,
	LiquidityPool_TimestampSchema,
	LitecoinMwebBlockSchema,
	LitecoinMwebOutputSchema,
	LitecoinMwebPegInSchema,
	LitecoinMwebPegOutSchema,
	LitecoinMwebTransactionSchema,
	LogosBlockchainNetworkSchema,
	LogosBlockchainNetwork_TimestampSchema,
	MagnetLinkSchema,
	MagnetResolution_TimestampSchema,
	MarketSchema,
	Market_Derivative_TimestampSchema,
	Market_TimeInterval_TimestampSchema,
	Market_TimestampSchema,
	MarketAssetSchema,
	MarketPriceSchema,
	MarketVenueSchema,
	McpPromptSchema,
	McpPromptResultSchema,
	McpResourceSchema,
	McpResourceContent_TimestampSchema,
	McpResourceTemplateSchema,
	McpServerSchema,
	McpServer_TimestampSchema,
	McpServerPackageSchema,
	McpServerPackageVersionSchema,
	McpToolSchema,
	McpToolCallSchema,
	McpToolCall_TimestampSchema,
	MediaSchema,
	MevBuilderSchema,
	MevBuilder_TimestampSchema,
	MevRelaySchema,
	MevRelay_ProposerPayloadDeliveredSchema,
	MevRelay_TimestampSchema,
	MoneroBlockSchema,
	MoneroKeyImageSchema,
	MoneroNetworkSchema,
	MoneroNetwork_TimestampSchema,
	MoneroRingSchema,
	MoneroRingMemberSchema,
	MoneroStealthOutputSchema,
	MoneroTransactionSchema,
	MoveFunctionSchema,
	MoveModuleSchema,
] as const

const schemaChunk14 = [
	MoveModule_TimestampSchema,
	MoveStructSchema,
	NearAccessKeySchema,
	NearAccessKey_TimestampSchema,
	NearAccountSchema,
	NearAccount_TimestampSchema,
	NearActionSchema,
	NearBlockSchema,
	NearChunkSchema,
	NearContractSchema,
	NearContract_TimestampSchema,
	NearContractStorageEntrySchema,
	NearExecutionOutcomeSchema,
	NearNetworkSchema,
	NearNetwork_TimestampSchema,
	NearReceiptSchema,
	NearTransactionSchema,
	NearValidatorSchema,
	NearValidator_TimestampSchema,
	NetworkSchema,
	Network_Activity_DaySchema,
	Network_TimestampSchema,
	NetworkEndpointObservation_TimestampSchema,
	NetworkStackSchema,
	NetworkUpgradeSchema,
	NetworkUpgrade_TimestampSchema,
	NftCollectionSchema,
	NftTokenSchema,
	NostrArticleSchema,
	NostrArticleEventSchema,
	NostrNetworkSchema,
	NostrNoteSchema,
	NostrProfileSchema,
	NostrProfileMetadataEventSchema,
	NostrReactionSchema,
	NostrRelaySchema,
	NostrRelay_TimestampSchema,
	NostrRepostSchema,
	NostrSearchQuerySchema,
	OracleFeedSchema,
	OracleFeed_RoundSchema,
	OracleFeed_TimestampSchema,
	PayjoinDirectorySchema,
	PayjoinEndpointSchema,
	PayjoinEndpoint_TimestampSchema,
	PayoutSchema,
	PayoutClaim_TimestampSchema,
	PolkadotAccountSchema,
	PolkadotAccount_TimestampSchema,
	PolkadotAssetSchema,
] as const

const schemaChunk15 = [
	PolkadotAsset_TimestampSchema,
	PolkadotAssetBalance_TimestampSchema,
	PolkadotBlockSchema,
	PolkadotEventSchema,
	PolkadotExtrinsicSchema,
	PolkadotPalletSchema,
	PolkadotReferendumSchema,
	PolkadotReferendum_TimestampSchema,
	PolkadotValidatorSchema,
	PolkadotValidator_EraSchema,
	PythPriceFeedSchema,
	PythPriceFeed_TimestampSchema,
	QuilibriumAccountSchema,
	QuilibriumFrameSchema,
	QuilibriumProverSchema,
	QuilibriumShardSchema,
	RadicleCollaborationEventSchema,
	RadicleDelegateSchema,
	RadicleDiscussionCommentSchema,
	RadicleIdentityDocumentSchema,
	RadicleIdentityRevisionSchema,
	RadicleIssueSchema,
	RadiclePatchSchema,
	RadicleRepositorySchema,
	RadicleSignedRefSchema,
	RadicleSignedRef_TimestampSchema,
	RedditCommentSchema,
	RedditComment_TimestampSchema,
	RedditLinkSchema,
	RedditLink_TimestampSchema,
	RedditNetworkSchema,
	RedditSubredditSchema,
	RedditSubreddit_TimestampSchema,
	RegulatedAssetProfileSchema,
	RegulatedAssetProfile_TimestampSchema,
	RoyaltyRight_TimestampSchema,
	RssFeedSchema,
	RssFeed_TimestampSchema,
	RssItemSchema,
	RssItem_TimestampSchema,
	RssNetworkSchema,
	ScalingDeploymentClaimSchema,
	ScalingDeploymentClaim_TimestampSchema,
	SolanaAccountSchema,
	SolanaAccount_TimestampSchema,
	SolanaBlockSchema,
	SolanaInstructionSchema,
	SolanaProgramSchema,
	SolanaTokenAccountSchema,
	SolanaTokenAccount_TimestampSchema,
] as const

const schemaChunk16 = [
	SolanaTokenMintSchema,
	SolanaTokenMint_TimestampSchema,
	SolanaTransactionSchema,
	SolanaTransaction_TimestampSchema,
	SolanaValidatorSchema,
	SolanaValidator_TimestampSchema,
	SorobanContractSchema,
	SorobanContract_TimestampSchema,
	SorobanContractStorageEntrySchema,
	SorobanContractStorageEntry_TimestampSchema,
	SorobanWasmSchema,
	SorobanWasm_TimestampSchema,
	SpecificationProposalSchema,
	SpecificationProposalKindSchema,
	SpecificationRealmSchema,
	StarknetAccount_TimestampSchema,
	StarknetBlockSchema,
	StarknetClassSchema,
	StarknetContractSchema,
	StarknetEventSchema,
	StarknetNetworkSchema,
	StarknetNetwork_TimestampSchema,
	StarknetStorageEntrySchema,
	StarknetStorageEntry_TimestampSchema,
	StarknetTransactionSchema,
	StarknetTransaction_TimestampSchema,
	StellarAccountSchema,
	StellarAccount_TimestampSchema,
	StellarAccountSignerSchema,
	StellarAccountSigner_TimestampSchema,
	StellarAssetSchema,
	StellarClaimableBalanceSchema,
	StellarClaimableBalance_TimestampSchema,
	StellarLedgerSchema,
	StellarLiquidityPoolSchema,
	StellarLiquidityPool_TimestampSchema,
	StellarNetworkSchema,
	StellarNetwork_TimestampSchema,
	StellarOfferSchema,
	StellarOffer_TimestampSchema,
	StellarOperationSchema,
	StellarTradeSchema,
	StellarTransactionSchema,
	StellarTransaction_TimestampSchema,
	StellarTrustlineSchema,
	StellarTrustline_TimestampSchema,
	SuiAccountSchema,
	SuiBalanceChangeSchema,
	SuiCheckpointSchema,
	SuiCoinBalance_TimestampSchema,
] as const

const schemaChunk17 = [
	SuiCoinTypeSchema,
	SuiDynamicFieldEdgeSchema,
	SuiDynamicFieldEdge_TimestampSchema,
	SuiEventSchema,
	SuiNetworkSchema,
	SuiNetwork_TimestampSchema,
	SuiObjectSchema,
	SuiObjectChangeSchema,
	SuiObjectVersionSchema,
	SuiPackageSchema,
	SuiPackageUpgradeSchema,
	SuiPackageVersionSchema,
	SuiProgrammableTransactionCommandSchema,
	SuiRegulatedCoinState_TimestampSchema,
	SuiTransactionSchema,
	SuiTransaction_TimestampSchema,
	SwapQuote_TimestampSchema,
	SwapQuoteStepSchema,
	SwarmProtocolSchema,
	SwarmResourceSchema,
	TezosAccountSchema,
	TezosAccount_TimestampSchema,
	TezosBakerSchema,
	TezosBaker_Cycle_TimestampSchema,
	TezosBaker_TimestampSchema,
	TezosBakingRightSchema,
	TezosBakingRight_TimestampSchema,
	TezosBigMapSchema,
	TezosBigMap_TimestampSchema,
	TezosBigMapDiffSchema,
	TezosBigMapKeySchema,
	TezosBigMapKey_TimestampSchema,
	TezosBlockSchema,
	TezosContractSchema,
	TezosContract_TimestampSchema,
	TezosCycleSchema,
	TezosEntrypointSchema,
	TezosInternalOperationSchema,
	TezosMichelsonScriptSchema,
	TezosNetworkSchema,
	TezosNetwork_TimestampSchema,
	TezosOperationSchema,
	TezosOperationGroupSchema,
	TezosTokenSchema,
	TezosToken_TimestampSchema,
	TezosTokenBalance_TimestampSchema,
	TezosTokenTransferSchema,
	TokenMetadataDocumentSchema,
	TokenProgramExtension_TimestampSchema,
	TonAccountSchema,
] as const

const schemaChunk18 = [
	TonAccount_TimestampSchema,
	TonBlockSchema,
	TonContractSchema,
	TonContract_TimestampSchema,
	TonContractGetMethodSchema,
	TonContractGetMethod_TimestampSchema,
	TonJettonSchema,
	TonJetton_TimestampSchema,
	TonJettonBalance_TimestampSchema,
	TonJettonTransferSchema,
	TonMessageSchema,
	TonNetwork_TimestampSchema,
	TonNftCollectionSchema,
	TonNftCollection_TimestampSchema,
	TonNftItemSchema,
	TonNftItem_TimestampSchema,
	TonNftTransferSchema,
	TonShard_TimestampSchema,
	TonTraceSchema,
	TonTrace_TimestampSchema,
	TonTransactionSchema,
	TonTransactionPhaseSchema,
	TonWorkchainSchema,
	TransferRestrictionSchema,
	TransferRestrictionCheck_TimestampSchema,
	TronAccountSchema,
	TronAccount_TimestampSchema,
	TronAccountTokenBalance_TimestampSchema,
	TronBlockSchema,
	TronContractSchema,
	TronContract_TimestampSchema,
	TronNetwork_TimestampSchema,
	TronTokenSchema,
	TronToken_TimestampSchema,
	TronTokenTransferSchema,
	TronTransactionSchema,
	TronTransactionReceiptSchema,
	TronWitnessSchema,
	TronWitness_TimestampSchema,
	TrustedIssuerSchema,
	UniswapV3PoolSchema,
	UniswapV3Pool_BlockSchema,
	UniswapV3PositionSchema,
	UniswapV3Position_BlockSchema,
	UrlSchema,
	UrlPreview_TimestampSchema,
	UsageRight_TimestampSchema,
	UtxoAddressSchema,
	UtxoAddress_TimestampSchema,
	UtxoBlockSchema,
] as const

const schemaChunk19 = [
	UtxoInputSchema,
	UtxoOutputSchema,
	UtxoTransactionSchema,
	WalletConnectionMethodSchema,
	XmtpConversationSchema,
	XmtpNetworkSchema,
	XNetworkSchema,
	XPostSchema,
	XPost_TimestampSchema,
	XrplAccountSchema,
	XrplAccount_TimestampSchema,
	XrplAmendmentSchema,
	XrplAmendment_TimestampSchema,
	XrplAmmSchema,
	XrplAmm_TimestampSchema,
	XrplLedgerSchema,
	XrplLedgerEntrySchema,
	XrplTransactionSchema,
	XrplTransaction_TimestampSchema,
	XrplTrustlineSchema,
	XrplTrustline_TimestampSchema,
	XUserSchema,
	XUser_TimestampSchema,
	YoutubeChannelSchema,
	YoutubeChannel_TimestampSchema,
	YoutubeCommentSchema,
	YoutubeComment_TimestampSchema,
	YoutubeNetworkSchema,
	YoutubePlaylistSchema,
	YoutubePlaylist_TimestampSchema,
	YoutubeVideoSchema,
	YoutubeVideo_TimestampSchema,
	ZcashShieldedActionSchema,
	ZcashShieldedPoolSchema,
	ZcashShieldedPoolBlockStateSchema,
	ZeroGConsensusNetworkSchema,
	ZeroGConsensusNetwork_TimestampSchema,
	ZeroGDaNodeSchema,
	ZeroGDaQuorumSchema,
	ZeroGDataBlobSchema,
	ZeroGDataChunkSchema,
	ZeroGKvEntrySchema,
	ZeroGNetworkSchema,
	ZeroGNetwork_TimestampSchema,
	ZeroGServiceProviderSchema,
	ZeroGServiceRequestSchema,
	ZeroGSettlementTraceSchema,
	ZeroGStorageLogEntrySchema,
	ZeroGStorageNodeSchema,
	ZeroGStorageNode_TimestampSchema,
] as const

const schemaChunk20 = [
	ZeroGStorageProofSchema,
] as const

export const schema = [
	...schemaChunk0,
	...schemaChunk1,
	...schemaChunk2,
	...schemaChunk3,
	...schemaChunk4,
	...schemaChunk5,
	...schemaChunk6,
	...schemaChunk7,
	...schemaChunk8,
	...schemaChunk9,
	...schemaChunk10,
	...schemaChunk11,
	...schemaChunk12,
	...schemaChunk13,
	...schemaChunk14,
	...schemaChunk15,
	...schemaChunk16,
	...schemaChunk17,
	...schemaChunk18,
	...schemaChunk19,
	...schemaChunk20,
] as const satisfies Schema
export const schemaMeta = indexSchema(schema)
export const entityDefinitionByType = schemaMeta.entityDefinitionByType

export type RegisteredEntityDefinitionByType = typeof entityDefinitionByType
export type RegisteredEntityType = keyof RegisteredEntityDefinitionByType
export type RegisteredSchema = typeof schema & {
	readonly entityDefinitionByType: RegisteredEntityDefinitionByType
}
export type RegisteredEntitySelector<_EntityType extends RegisteredEntityType> = EntitySelector<RegisteredSchema, _EntityType>
export type EntitySchemaFieldName<_EntityType extends RegisteredEntityType> = EntityFieldDefinitions<RegisteredEntityDefinitionByType[_EntityType]>['name']
