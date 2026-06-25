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
		href: '/network/[caip2]',
		selectorNormalization: 'chainId to CAIP-2 eip155 selector',
	},
	query: {
		sources: [
			'Constants_Internal',
			'Chainlist_Rest',
			'EthereumLists_Rest',
			'L2Beat_Rest',
			'Superchain_Github',
			'Voltaire_JsonRpc',
		],
		openFields: [
			'$$blocks',
			'$$transactions',
			'$$gasFeeBlocks',
			'$$gasEstimateTimestamps',
			'$$txpoolTimestamps',
			'$$beaconEpochs',
			'$$beaconSlots',
		],
		slot: 'EvmNetworkQueryPolicy',
	},
	media: {
		image: '$icon',
		title: 'name',
		fallbackIcon: 'network',
		slot: 'EvmNetworkHeading',
	},
	latest: [
		{
			field: '$$blocks',
			sort: 'blockNumber',
			direction: 'desc',
			view: 'EvmBlockView',
			slot: 'HeadBlock',
		},
		{
			field: '$$gasFeeBlocks',
			sort: 'blockNumber',
			direction: 'desc',
			view: 'EvmNetwork_GasFee_BlockView',
			slot: 'LatestGasFeeBlock',
		},
		{
			field: '$$txpoolTimestamps',
			sort: 'timestampMs',
			direction: 'desc',
			view: 'EvmNetwork_Txpool_TimestampView',
			slot: 'LatestTxpool',
		},
	],
	slots: [
		{
			slot: 'ExecutionCarousel',
			label: 'execution carousel sections',
			for: 'Details',
		},
		{
			slot: 'ConsensusCarousel',
			label: 'consensus and block production carousel sections',
			for: 'Details',
		},
	],
	closed: [
		{
			label: 'current upgrade',
		},
		{
			label: 'head block',
		},
		{
			label: 'consensus slot/finality',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'current upgrade',
				},
				{
					label: 'head block',
				},
				{
					label: 'consensus epoch/slot/finality',
				},
				{
					label: 'gas/txpool',
				},
			],
			[
				'environment',
				{
					label: 'layer',
				},
				{
					label: 'native coin/asset',
				},
				'$mainnet',
				{
					label: 'rollup hints',
				},
			],
			[
				'consensusProtocol',
				'caip2',
				'registryStatus',
				'peeringId',
				'slip44',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					'$$upgrades',
					'$$blocks',
					'$$transactions',
					{
						label: 'Mempool',
					},
					{
						label: 'Fee market',
					},
					{
						label: 'Endpoints',
					},
				],
			},
			{
				label: 'Consensus & Block Production',
				items: [
					'$$upgrades',
					{
						label: 'Finality',
					},
					{
						label: 'Committees',
					},
					{
						label: 'Sync committees',
					},
					{
						label: 'Attestations',
					},
					{
						label: 'Withdrawals',
					},
					{
						label: 'Slashings',
					},
					{
						label: 'Validators',
					},
					{
						label: 'Epochs',
					},
					{
						label: 'Slots',
					},
					{
						label: 'Relays',
					},
					{
						label: 'Builders',
					},
					{
						label: 'MEV-Boost',
					},
					{
						label: 'Endpoints',
					},
				],
			},
			{
				label: 'Data Availability',
				items: [
					'$$blobs',
				],
			},
			{
				label: 'Contracts & Accounts',
				items: [
					'$$precompiles',
					{
						label: 'Verified contracts',
					},
					{
						label: 'Smart accounts',
					},
					{
						label: 'Bundlers',
					},
					{
						label: 'Paymasters',
					},
					'$$userOperations',
					{
						label: 'Factories',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					'$nativeCoin',
					'$$bridges',
					{
						label: 'ERC-20 transfers',
					},
					{
						label: 'NFT transfers',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'Faucets',
					},
					{
						label: 'Block explorers',
					},
				],
			},
			{
				label: 'Topology',
				items: [
					'$$upgrades',
					'$parent',
					'$rollup',
					{
						label: 'Shards',
					},
					'$$testnets',
					'$mainnet',
					{
						label: 'Layers',
					},
					'$$settledRollups',
				],
			},
		],
	},
	lists: [
		{
			id: 'rpc-urls',
			label: 'rpc urls',
			field: '$$rpcUrls',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'block-explorer-urls',
			label: 'block explorer urls',
			field: '$$blockExplorerUrls',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'faucet-urls',
			label: 'faucet urls',
			field: '$$faucetUrls',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'native-assets',
			label: 'native assets',
			field: '$$nativeAssets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'testnets',
			label: 'testnets',
			field: '$$testnets',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'sibling-shard-networks',
			label: 'sibling shard networks',
			field: '$$siblingShardNetworks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'upgrades',
			label: 'upgrades',
			field: '$$upgrades',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'execution-upgrades',
			label: 'execution upgrades',
			field: '$$executionUpgrades',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'consensus-upgrades',
			label: 'consensus upgrades',
			field: '$$consensusUpgrades',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'bridges',
			label: 'bridges',
			field: '$$bridges',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'settled-rollups',
			label: 'settled rollups',
			field: '$$settledRollups',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'contracts',
			label: 'contracts',
			field: '$$contracts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'precompiles',
			label: 'precompiles',
			field: '$$precompiles',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blobs',
			label: 'blobs',
			field: '$$blobs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'gas-fee-blocks',
			label: 'gas fee blocks',
			field: '$$gasFeeBlocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'gas-estimate-timestamps',
			label: 'gas estimate timestamps',
			field: '$$gasEstimateTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'txpool-timestamps',
			label: 'txpool timestamps',
			field: '$$txpoolTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'erc20-token-transfers',
			label: 'erc20 token transfers',
			field: '$$erc20TokenTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'nft-token-transfers',
			label: 'nft token transfers',
			field: '$$nftTokenTransfers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'erc4337-smart-accounts',
			label: 'erc4337 smart accounts',
			field: '$$erc4337SmartAccounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'erc4337-bundlers',
			label: 'erc4337 bundlers',
			field: '$$erc4337Bundlers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'erc4337-paymasters',
			label: 'erc4337 paymasters',
			field: '$$erc4337Paymasters',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'erc4337-account-factories',
			label: 'erc4337 account factories',
			field: '$$erc4337AccountFactories',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'user-operations',
			label: 'user operations',
			field: '$$userOperations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-finality-timestamps',
			label: 'beacon finality timestamps',
			field: '$$beaconFinalityTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-epochs',
			label: 'beacon epochs',
			field: '$$beaconEpochs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-slots',
			label: 'beacon slots',
			field: '$$beaconSlots',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-committees',
			label: 'beacon committees',
			field: '$$beaconCommittees',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-sync-committees',
			label: 'beacon sync committees',
			field: '$$beaconSyncCommittees',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-attestations',
			label: 'beacon attestations',
			field: '$$beaconAttestations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-withdrawals',
			label: 'beacon withdrawals',
			field: '$$beaconWithdrawals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-slashings',
			label: 'beacon slashings',
			field: '$$beaconSlashings',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'beacon-validators',
			label: 'beacon validators',
			field: '$$beaconValidators',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'mev-relays',
			label: 'mev relays',
			field: '$$mevRelays',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'mev-builders',
			label: 'mev builders',
			field: '$$mevBuilders',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'mev-proposer-payload-delivered',
			label: 'mev proposer payload deliveredses',
			field: '$$mevProposerPayloadDelivered',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork>
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
	entityType={EntityType.EvmNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
