<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'scope',
		],
		content: {
			dl: [
				[
					'scope',
					'proposalRealms',
					'proposalCategories',
					'duneCreditsUsed',
					'duneCreditsIncluded',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'networks',
					when: 'open',
					items: [
						'$$networks',
					],
				},
				{
					label: 'evm networks',
					when: 'open',
					items: [
						'$$evmNetworks',
					],
				},
				{
					label: 'network upgrades',
					when: 'open',
					items: [
						'$$networkUpgrades',
					],
				},
				{
					label: 'proposals',
					when: 'open',
					items: [
						'$$proposals',
					],
				},
				{
					label: 'specification realms',
					when: 'open',
					items: [
						'$$specificationRealms',
					],
				},
				{
					label: 'proposal kinds',
					when: 'open',
					items: [
						'$$proposalKinds',
					],
				},
				{
					label: 'coins',
					when: 'open',
					items: [
						'$$coins',
					],
				},
				{
					label: 'markets',
					when: 'open',
					items: [
						'$$markets',
					],
				},
				{
					label: 'market venues',
					when: 'open',
					items: [
						'$$marketVenues',
					],
				},
				{
					label: 'currencies',
					when: 'open',
					items: [
						'$$currencies',
					],
				},
				{
					label: 'market quotes',
					when: 'open',
					items: [
						'$$marketQuotes',
					],
				},
				{
					label: 'market time interval timestamps',
					when: 'open',
					items: [
						'$$marketTimeIntervalTimestamps',
					],
				},
				{
					label: 'actors',
					when: 'open',
					items: [
						'$$actors',
					],
				},
				{
					label: 'xmtp conversations',
					when: 'open',
					items: [
						'$$xmtpConversations',
					],
				},
				{
					label: 'blockhead sources',
					when: 'open',
					items: [
						'$$blockheadSources',
					],
				},
				{
					label: 'blockhead wallets',
					when: 'open',
					items: [
						'$$blockheadWallets',
					],
				},
				{
					label: 'blockhead wallet connections',
					when: 'open',
					items: [
						'$$blockheadWalletConnections',
					],
				},
				{
					label: 'blockhead wallet accounts',
					when: 'open',
					items: [
						'$$blockheadWalletAccounts',
					],
				},
				{
					label: 'blockhead wallet transport sessions',
					when: 'open',
					items: [
						'$$blockheadWalletTransportSessions',
					],
				},
				{
					label: 'blockhead wallet requests',
					when: 'open',
					items: [
						'$$blockheadWalletRequests',
					],
				},
				{
					label: 'blockhead wallet capability grants',
					when: 'open',
					items: [
						'$$blockheadWalletCapabilityGrants',
					],
				},
				{
					label: 'blockhead wallet authentications',
					when: 'open',
					items: [
						'$$blockheadWalletAuthentications',
					],
				},
				{
					label: 'blockhead sessions',
					when: 'open',
					items: [
						'$$blockheadSessions',
					],
				},
				{
					label: 'blockhead panel trees',
					when: 'open',
					items: [
						'$$blockheadPanelTrees',
					],
				},
				{
					label: 'blockhead farcaster account connections',
					when: 'open',
					items: [
						'$$blockheadFarcasterAccountConnections',
					],
				},
				{
					label: 'blockhead agent conversations',
					when: 'open',
					items: [
						'$$blockheadAgentConversations',
					],
				},
				{
					label: 'ai model catalogs',
					when: 'open',
					items: [
						'$$aiModelCatalogs',
					],
				},
				{
					label: 'ai artifact catalogs',
					when: 'open',
					items: [
						'$$aiArtifactCatalogs',
					],
				},
				{
					label: 'agent networks',
					when: 'open',
					items: [
						'$$agentNetworks',
					],
				},
				{
					label: 'blockhead algorand participation keys',
					when: 'open',
					items: [
						'$$blockheadAlgorandParticipationKeys',
					],
				},
				{
					label: 'blockhead bridge transactions',
					when: 'open',
					items: [
						'$$blockheadBridgeTransactions',
					],
				},
				{
					label: 'bridge transfers',
					when: 'open',
					items: [
						'$$bridgeTransfers',
					],
				},
				{
					label: 'eip8004 services',
					when: 'open',
					items: [
						'$$eip8004Services',
					],
				},
				{
					label: 'blockhead room peers',
					when: 'open',
					items: [
						'$$blockheadRoomPeers',
					],
				},
				{
					label: 'blockhead rooms',
					when: 'open',
					items: [
						'$$blockheadRooms',
					],
				},
				{
					label: 'blockhead state channels',
					when: 'open',
					items: [
						'$$blockheadStateChannels',
					],
				},
				{
					label: 'liquidity positions',
					when: 'open',
					items: [
						'$$liquidityPositions',
					],
				},
				{
					label: 'liquidity pools',
					when: 'open',
					items: [
						'$$liquidityPools',
					],
				},
				{
					label: 'blockhead shared addresses',
					when: 'open',
					items: [
						'$$blockheadSharedAddresses',
					],
				},
				{
					label: 'blockhead zero gstorage node states',
					when: 'open',
					items: [
						'$$blockheadZeroGStorageNodeStates',
					],
				},
				{
					label: 'blockhead zero gstored chunks',
					when: 'open',
					items: [
						'$$blockheadZeroGStoredChunks',
					],
				},
				{
					label: 'blockhead zero gstorage proofs',
					when: 'open',
					items: [
						'$$blockheadZeroGStorageProofs',
					],
				},
				{
					label: 'actor coins',
					when: 'open',
					items: [
						'$$actorCoins',
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
