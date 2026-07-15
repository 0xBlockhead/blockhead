// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalSelector {
	Scope = 'Scope',
}
export const _Global = entity({
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$networks: {
		label: 'networks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.Many,
	},
	$$networkStacks: {
		label: 'network stacks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NetworkStack,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmNetworks: {
		label: 'EVM networks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.Many,
	},
	$$networkUpgrades: {
		label: 'network upgrades',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EthereumNetworkUpgrade,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proposals: {
		label: 'proposals',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SpecificationProposal,
		cardinality: EntityFieldCardinality.Many,
	},
	$$specificationRealms: {
		label: 'specification realms',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SpecificationRealm,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proposalKinds: {
		label: 'proposal kinds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SpecificationProposalKind,
		cardinality: EntityFieldCardinality.Many,
	},
	$$coins: {
		label: 'coins',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Coin,
		cardinality: EntityFieldCardinality.Many,
	},
	$$markets: {
		label: 'markets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$marketVenues: {
		label: 'market venues',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MarketVenue,
		cardinality: EntityFieldCardinality.Many,
	},
	$$currencies: {
		label: 'currencies',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Currency,
		cardinality: EntityFieldCardinality.Many,
	},
	$$marketPrices: {
		label: 'market prices',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MarketPrice,
		cardinality: EntityFieldCardinality.Many,
	},
	$$marketTimeIntervalTimestamps: {
		label: 'market time interval timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market_TimeInterval_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$actors: {
		label: 'actors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$xmtpConversations: {
		label: 'XMTP conversations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XmtpConversation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSources: {
		label: 'blockhead sources',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadSource,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWallets: {
		label: 'blockhead wallets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletConnections: {
		label: 'blockhead wallet connections',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletAccounts: {
		label: 'blockhead wallet accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletTransportSessions: {
		label: 'blockhead wallet transport sessions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletTransportSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletRequests: {
		label: 'blockhead wallet requests',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletRequest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletCapabilityGrants: {
		label: 'blockhead wallet capability grants',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletCapabilityGrant,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWalletAuthentications: {
		label: 'blockhead wallet authentications',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWalletAuthentication,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSessions: {
		label: 'blockhead sessions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadWorkspaces: {
		label: 'blockhead workspaces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadWorkspace,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadPanelTrees: {
		label: 'blockhead panel trees',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadLocalMediaIngests: {
		label: 'blockhead local media ingests',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadLocalMediaIngest,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadFarcasterAccountConnections: {
		label: 'blockhead Farcaster account connections',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadFarcasterAccountConnection,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAgentConversations: {
		label: 'blockhead agent conversations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadAgentConversation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aiModelCatalogs: {
		label: 'AI model catalogs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalAiModelCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$aiArtifactCatalogs: {
		label: 'AI artifact catalogs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalAiArtifactCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$agentNetworks: {
		label: 'agent networks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalAgentNetwork,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmAbiCatalogs: {
		label: 'EVM ABI catalogs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalEvmAbiCatalog,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadAlgorandParticipationKeys: {
		label: 'blockhead algorand participation keys',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadAlgorandParticipationKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransactions: {
		label: 'bridge transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadBridgeTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bridgeTransfers: {
		label: 'bridge transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BridgeTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$eip8004Services: {
		label: 'eip8004 services',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmNft,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadRoomPeers: {
		label: 'blockhead room peers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRoomPeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadRooms: {
		label: 'blockhead rooms',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadStateChannels: {
		label: 'blockhead state channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadStateChannel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		label: 'liquidity pools',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadSharedAddresses: {
		label: 'blockhead shared addresses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadSharedAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStorageNodeStates: {
		label: 'blockhead zero g storage node states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStoredChunks: {
		label: 'blockhead zero g stored chunks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZeroGStoredChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blockheadZeroGStorageProofs: {
		label: 'blockhead zero g storage proofs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZeroGStorageProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$actorCoins: {
		label: 'actor coins',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmNetworkActorCoinBalance,
		cardinality: EntityFieldCardinality.Many,
	},
	duneCreditsUsed: {
		label: 'dune credits used',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	duneCreditsIncluded: {
		label: 'dune credits included',
		type: EntityFieldType.Primitive,
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
