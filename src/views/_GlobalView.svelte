<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	route: {
		slot: 'GlobalRouteChildren',
		selectorNormalization: 'global hub route composition',
		kind: 'route',
		component: 'GlobalView',
		children: 'route',
	},
	lists: [
		{
			id: 'nav',
			label: 'Navigation',
			slot: 'GlobalNavigation',
		},
		{
			id: 'ai',
			label: 'AI',
			slot: 'GlobalAiCatalogs',
		},
		{
			id: 'proposals',
			label: 'Proposals',
			slot: 'GlobalProposalFilters',
		},
		{
			id: 'networks',
			label: 'networks',
			field: '$$networks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'evm-networks',
			label: 'evm networks',
			field: '$$evmNetworks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'network-upgrades',
			label: 'network upgrades',
			field: '$$networkUpgrades',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'proposals',
			label: 'proposals',
			field: '$$proposals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'specification-realms',
			label: 'specification realms',
			field: '$$specificationRealms',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'proposal-kinds',
			label: 'proposal kinds',
			field: '$$proposalKinds',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'coins',
			label: 'coins',
			field: '$$coins',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'markets',
			label: 'markets',
			field: '$$markets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'market-venues',
			label: 'market venues',
			field: '$$marketVenues',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'currencies',
			label: 'currencies',
			field: '$$currencies',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'market-quotes',
			label: 'market quotes',
			field: '$$marketQuotes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'market-time-interval-timestamps',
			label: 'market time interval timestamps',
			field: '$$marketTimeIntervalTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'actors',
			label: 'actors',
			field: '$$actors',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'xmtp-conversations',
			label: 'xmtp conversations',
			field: '$$xmtpConversations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-sources',
			label: 'blockhead sources',
			field: '$$blockheadSources',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallets',
			label: 'blockhead wallets',
			field: '$$blockheadWallets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallet-connections',
			label: 'blockhead wallet connections',
			field: '$$blockheadWalletConnections',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallet-accounts',
			label: 'blockhead wallet accounts',
			field: '$$blockheadWalletAccounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallet-transport-sessions',
			label: 'blockhead wallet transport sessions',
			field: '$$blockheadWalletTransportSessions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallet-requests',
			label: 'blockhead wallet requests',
			field: '$$blockheadWalletRequests',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallet-capability-grants',
			label: 'blockhead wallet capability grants',
			field: '$$blockheadWalletCapabilityGrants',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-wallet-authentications',
			label: 'blockhead wallet authentications',
			field: '$$blockheadWalletAuthentications',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-sessions',
			label: 'blockhead sessions',
			field: '$$blockheadSessions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-panel-trees',
			label: 'blockhead panel trees',
			field: '$$blockheadPanelTrees',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-farcaster-account-connections',
			label: 'blockhead farcaster account connections',
			field: '$$blockheadFarcasterAccountConnections',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-agent-conversations',
			label: 'blockhead agent conversations',
			field: '$$blockheadAgentConversations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'ai-model-catalogs',
			label: 'ai model catalogs',
			field: '$$aiModelCatalogs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'ai-artifact-catalogs',
			label: 'ai artifact catalogs',
			field: '$$aiArtifactCatalogs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'agent-networks',
			label: 'agent networks',
			field: '$$agentNetworks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-algorand-participation-keys',
			label: 'blockhead algorand participation keys',
			field: '$$blockheadAlgorandParticipationKeys',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-bridge-transactions',
			label: 'blockhead bridge transactions',
			field: '$$blockheadBridgeTransactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'bridge-transfers',
			label: 'bridge transfers',
			field: '$$bridgeTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'eip8004-services',
			label: 'eip8004 services',
			field: '$$eip8004Services',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-room-peers',
			label: 'blockhead room peers',
			field: '$$blockheadRoomPeers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-rooms',
			label: 'blockhead rooms',
			field: '$$blockheadRooms',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-state-channels',
			label: 'blockhead state channels',
			field: '$$blockheadStateChannels',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'liquidity-positions',
			label: 'liquidity positions',
			field: '$$liquidityPositions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'liquidity-pools',
			label: 'liquidity pools',
			field: '$$liquidityPools',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-shared-addresses',
			label: 'blockhead shared addresses',
			field: '$$blockheadSharedAddresses',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-zero-gstorage-node-states',
			label: 'blockhead zero gstorage node states',
			field: '$$blockheadZeroGStorageNodeStates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-zero-gstored-chunks',
			label: 'blockhead zero gstored chunks',
			field: '$$blockheadZeroGStoredChunks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-zero-gstorage-proofs',
			label: 'blockhead zero gstorage proofs',
			field: '$$blockheadZeroGStorageProofs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'actor-coins',
			label: 'actor coins',
			field: '$$actorCoins',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
	slots: [
		{
			slot: 'GlobalRouteChildren',
			label: 'route children',
			for: 'Content',
		},
		{
			slot: 'GlobalNavigation',
			label: 'route shortcut list',
			for: 'List',
		},
	],
	closed: [
		{
			label: 'scope/title',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'scope/title',
				},
			],
		],
		blocks: [
			[
				{
					label: 'Dune usage when no route children are supplied',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Nav',
				items: [
					{
						label: 'route shortcut list',
					},
				],
			},
			{
				label: 'AI',
				items: [
					{
						label: '_GlobalAiModelCatalog',
					},
					{
						label: '_GlobalAiArtifactCatalog',
					},
					{
						label: '_GlobalAgentNetwork',
					},
				],
			},
			{
				label: 'Proposals',
				items: [
					'$specificationRealms',
					'$proposalKinds',
					'$proposals',
				],
			},
			{
				label: 'Usage',
				items: [
					{
						label: 'Dune credit counters',
					},
					{
						label: 'but those children do not create separate global entity families',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._Global>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType._Global}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
