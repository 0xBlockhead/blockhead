// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._Global,
	labels: {
		singular: 'global',
		plural: 'globals',
	},
	description: 'Root catalog and navigation scope for top-level networks, assets, markets, proposals, and local Blockhead state.',
})({
	scope: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$networks: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.Many,
	},
	$$networkStacks: {
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmNetworks: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.Many,
	},
	$$networkUpgrades: {
		entityType: EntityType.EthereumNetworkUpgrade,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$proposals: {
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$specificationRealms: {
		entityType: EntityType.SpecificationRealm,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$proposalKinds: {
		entityType: EntityType.SpecificationProposalKind,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$coins: {
		entityType: EntityType.Coin,
		cardinality: EntityFieldCardinality.Many,
	},
	$$markets: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$marketVenues: {
		entityType: EntityType.MarketVenue,
		cardinality: EntityFieldCardinality.Many,
	},
	$$currencies: {
		entityType: EntityType.Currency,
		cardinality: EntityFieldCardinality.Many,
	},
	$$marketPrices: {
		entityType: EntityType.MarketPrice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$marketTimeIntervalTimestamps: {
		entityType: EntityType.Market_TimeInterval_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Coingecko_Rest,
		],
	},
	$$actors: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$xmtpConversations: {
		entityType: EntityType.XmtpConversation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSources: {
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadWallets: {
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletConnections: {
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAccounts: {
		entityType: EntityType.BlockheadAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadWalletTransportSessions: {
		entityType: EntityType.BlockheadWalletTransportSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletRequests: {
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletCapabilityGrants: {
		entityType: EntityType.BlockheadWalletCapabilityGrant,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletAuthentications: {
		entityType: EntityType.BlockheadWalletAuthentication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSessions: {
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWorkspaces: {
		entityType: EntityType.BlockheadWorkspace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadPanelTrees: {
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadLocalMediaIngests: {
		entityType: EntityType.BlockheadLocalMediaIngest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadFarcasterAccountConnections: {
		entityType: EntityType.BlockheadFarcasterAccountConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAgentConversations: {
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aiModelCatalogs: {
		entityType: EntityType._GlobalAiModelCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aiArtifactCatalogs: {
		entityType: EntityType._GlobalAiArtifactCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$agentNetworks: {
		entityType: EntityType._GlobalAgentNetwork,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmAbiCatalogs: {
		entityType: EntityType._GlobalEvmAbiCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAlgorandParticipationKeys: {
		entityType: EntityType.BlockheadAlgorandParticipationKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransactions: {
		entityType: EntityType.BlockheadBridgeTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransfers: {
		entityType: EntityType.BridgeTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$eip8004Services: {
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Eip8004Scan_Rest,
		],
	},
	$$blockheadRoomPeers: {
		entityType: EntityType.BlockheadRoomPeer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadRooms: {
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadStateChannels: {
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSharedAddresses: {
		entityType: EntityType.BlockheadSharedAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStorageNodeStates: {
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStoredChunks: {
		entityType: EntityType.BlockheadZeroGStoredChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStorageProofs: {
		entityType: EntityType.BlockheadZeroGStorageProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$actorCoins: {
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	duneCreditsUsed: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	duneCreditsIncluded: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
