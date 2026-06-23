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
					{
						label: 'parent/mainnet',
					},
					{
						label: 'rollup hints',
					},
					{
						label: 'consensus protocol',
					},
					{
						label: 'CAIP-2',
					},
					{
						label: 'registry status',
					},
					{
						label: 'peering id',
					},
					{
						label: 'SLIP-44',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Execution',
					items: [
						{
							label: 'Upgrades',
						},
						{
							label: 'Blocks',
						},
						{
							label: 'Transactions',
						},
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
						{
							label: 'Upgrades',
						},
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
						{
							label: 'Blobs',
						},
					],
				},
				{
					label: 'Contracts & Accounts',
					items: [
						{
							label: 'Precompiles',
						},
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
						{
							label: 'User operations',
						},
						{
							label: 'Factories',
						},
					],
				},
				{
					label: 'Assets',
					items: [
						{
							label: 'Native coin',
						},
						{
							label: 'Bridges',
						},
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
						{
							label: 'Upgrades',
						},
						{
							label: 'Parent',
						},
						{
							label: 'Rollup',
						},
						{
							label: 'Shards',
						},
						{
							label: 'Testnets',
						},
						{
							label: 'Mainnet',
						},
						{
							label: 'Layers',
						},
						{
							label: 'Settled rollups',
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
