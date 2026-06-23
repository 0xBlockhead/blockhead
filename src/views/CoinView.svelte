<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		route: {
			href: '/coin/[coinId]',
			dependsOn: [
				'coinId',
			],
		},
		query: {
			sources: [
				'Constants_Internal',
			],
			fields: [
				'symbol',
			],
			openFields: [
				'$logo',
				'decimals',
				'name',
				'$$coinInstances',
				'$$bridgeCapabilities',
			],
			slot: 'CoinQueryPolicy',
		},
		media: {
			image: '$logo',
			title: 'name',
			fallbackIcon: 'coin',
			slot: 'CoinHeading',
		},
		metrics: [
			{
				label: 'Market cap',
				format: 'currency',
				slot: 'CatalogUsdMarketCap',
			},
		],
		latest: [
			{
				field: '$$timestamps',
				sort: 'timestampMs',
				direction: 'desc',
				view: 'Coin_TimestampView',
				slot: 'LatestCoinSnapshot',
			},
		],
		lists: [
			{
				id: 'coin-instances',
				label: 'EVM coin instances',
				field: '$$coinInstances',
				slot: 'CoinInstancesList',
			},
			{
				id: 'wrapped-coin-instances',
				label: 'Wrapped EVM coin instances',
				field: '$$coinInstances',
				slot: 'WrappedCoinInstancesList',
			},
			{
				id: 'bridge-capabilities',
				label: 'Bridge capabilities',
				field: '$$bridgeCapabilities',
				slot: 'BridgeCapabilitiesList',
			},
			{
				id: 'usd-market',
				label: 'Catalog USD market',
				slot: 'CatalogUsdMarket',
			},
		],
		closed: [
			{
				label: 'catalog coin id or name/symbol with logo',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'catalog coin id or name/symbol with logo',
					},
				],
				[
					{
						label: 'latest market cap rank',
					},
					{
						label: 'market cap',
					},
					{
						label: 'latest snapshot',
					},
					'decimals',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Topology',
					items: [
						{
							label: 'EVM coin instances',
						},
						{
							label: 'wrapped EVM coin instances filtered to bridge-wrapped representation',
						},
						{
							label: 'coin bridge capabilities',
						},
					],
				},
				{
					label: 'Markets',
					items: [
						{
							label: 'catalog USD market link',
						},
						{
							label: 'markets as base',
						},
						{
							label: 'markets as quote',
						},
					],
				},
				{
					label: 'Supply',
					items: [
						{
							label: 'provider-clock supply observations',
						},
						{
							label: 'ledger-coordinate supply observations through concrete asset instances',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'catalog rows',
						},
						{
							label: 'provider asset mappings',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		layout,
		open = $bindable(
			layout === undefined
			|| layout === EntityLayout.SummaryDetails
		),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Coin>
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.Coin}
	entitySelector={selection.entitySelector}
	bind:open
	{layout}
	{...EntityViewProps}
	{view}
/>
