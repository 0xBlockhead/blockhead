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
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$networks: {
		label: 'networks',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.Many,
	},
	$$networkStacks: {
		label: 'network stacks',
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmNetworks: {
		label: 'EVM networks',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.Many,
	},
	$$networkUpgrades: {
		label: 'network upgrades',
		entityType: EntityType.EthereumNetworkUpgrade,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$proposals: {
		label: 'proposals',
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$specificationRealms: {
		label: 'specification realms',
		entityType: EntityType.SpecificationRealm,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$proposalKinds: {
		label: 'proposal kinds',
		entityType: EntityType.SpecificationProposalKind,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$coins: {
		label: 'coins',
		entityType: EntityType.Coin,
		cardinality: EntityFieldCardinality.Many,
	},
	$$markets: {
		label: 'markets',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$marketVenues: {
		label: 'market venues',
		entityType: EntityType.MarketVenue,
		cardinality: EntityFieldCardinality.Many,
	},
	$$currencies: {
		label: 'currencies',
		entityType: EntityType.Currency,
		cardinality: EntityFieldCardinality.Many,
	},
	$$marketPrices: {
		label: 'market prices',
		entityType: EntityType.MarketPrice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$marketTimeIntervalTimestamps: {
		label: 'market time interval timestamps',
		entityType: EntityType.Market_TimeInterval_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$actors: {
		label: 'actors',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$xmtpConversations: {
		label: 'XMTP conversations',
		entityType: EntityType.XmtpConversation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSources: {
		label: 'blockhead sources',
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadWallets: {
		label: 'blockhead wallets',
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletConnections: {
		label: 'blockhead wallet connections',
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAccounts: {
		label: 'blockhead accounts',
		entityType: EntityType.BlockheadAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadWalletTransportSessions: {
		label: 'blockhead wallet transport sessions',
		entityType: EntityType.BlockheadWalletTransportSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletRequests: {
		label: 'blockhead wallet requests',
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletCapabilityGrants: {
		label: 'blockhead wallet capability grants',
		entityType: EntityType.BlockheadWalletCapabilityGrant,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletAuthentications: {
		label: 'blockhead wallet authentications',
		entityType: EntityType.BlockheadWalletAuthentication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSessions: {
		label: 'blockhead sessions',
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWorkspaces: {
		label: 'blockhead workspaces',
		entityType: EntityType.BlockheadWorkspace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadPanelTrees: {
		label: 'blockhead panel trees',
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadLocalMediaIngests: {
		label: 'blockhead local media ingests',
		entityType: EntityType.BlockheadLocalMediaIngest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadFarcasterAccountConnections: {
		label: 'blockhead Farcaster account connections',
		entityType: EntityType.BlockheadFarcasterAccountConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAgentConversations: {
		label: 'blockhead agent conversations',
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aiModelCatalogs: {
		label: 'AI model catalogs',
		entityType: EntityType._GlobalAiModelCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aiArtifactCatalogs: {
		label: 'AI artifact catalogs',
		entityType: EntityType._GlobalAiArtifactCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$agentNetworks: {
		label: 'agent networks',
		entityType: EntityType._GlobalAgentNetwork,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmAbiCatalogs: {
		label: 'EVM ABI catalogs',
		entityType: EntityType._GlobalEvmAbiCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAlgorandParticipationKeys: {
		label: 'blockhead algorand participation keys',
		entityType: EntityType.BlockheadAlgorandParticipationKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransactions: {
		label: 'bridge transactions',
		entityType: EntityType.BlockheadBridgeTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransfers: {
		label: 'bridge transfers',
		entityType: EntityType.BridgeTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$eip8004Services: {
		label: 'eip8004 services',
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Eip8004Scan_Rest,
		],
	},
	$$blockheadRoomPeers: {
		label: 'blockhead room peers',
		entityType: EntityType.BlockheadRoomPeer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadRooms: {
		label: 'blockhead rooms',
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$blockheadStateChannels: {
		label: 'blockhead state channels',
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		label: 'liquidity pools',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSharedAddresses: {
		label: 'blockhead shared addresses',
		entityType: EntityType.BlockheadSharedAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStorageNodeStates: {
		label: 'blockhead zero g storage node states',
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStoredChunks: {
		label: 'blockhead zero g stored chunks',
		entityType: EntityType.BlockheadZeroGStoredChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStorageProofs: {
		label: 'blockhead zero g storage proofs',
		entityType: EntityType.BlockheadZeroGStorageProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$actorCoins: {
		label: 'actor coins',
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	duneCreditsUsed: {
		label: 'dune credits used',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	duneCreditsIncluded: {
		label: 'dune credits included',
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
