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
		href: '/market/[marketKey]',
		dependsOn: [
			'$market',
		],
	},
	query: {
		sources: [
			'Blockscout_Rest',
			'Coingecko_Rest',
			'Coingecko_OpenApi',
			'CoinMarketCap_Rest',
			'Coinpaprika_OpenApi',
			'Defillama_OpenApi',
			'TradingView_Rest',
		],
		fields: [
			'price',
		],
		openFields: [
			'caip19',
			'marketCap',
			'volume24h',
			'transport',
			'providerAssetId',
		],
		slot: 'MarketTimestampQueryPolicy',
	},
	metrics: [
		{
			field: 'price',
			label: 'Price',
			format: 'currency',
			slot: 'PriceCurrencyAmount',
		},
		{
			field: 'marketCap',
			label: 'Market cap',
			format: 'currency',
			slot: 'MarketCapCurrencyAmount',
		},
		{
			field: 'volume24h',
			label: '24h volume',
			format: 'currency',
			slot: 'VolumeCurrencyAmount',
		},
	],
	lists: [
		{
			id: 'market-observations',
			label: 'Market observations',
			limit: 2048,
			query: {
				limit: 2048,
				sources: [
					'Blockscout_Rest',
					'Coingecko_Rest',
					'Coingecko_OpenApi',
					'CoinMarketCap_Rest',
					'Coinpaprika_OpenApi',
					'Defillama_OpenApi',
					'TradingView_Rest',
				],
			},
			sort: 'timestampMs',
			order: 'desc',
		},
	],
	closed: [
		'$market',
		'timestampMs',
		'feedKey',
	],
	content: {
		dl: [
			[
				'$market',
				'timestampMs',
				'feedKey',
				'price',
				'marketCap',
			],
			[
				'volume24h',
				'caip19',
				'transport',
				'providerAssetId',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Market',
				items: [
					'$market',
				],
			},
			{
				label: 'Quote',
				items: [
					'price',
					'timestampMs',
					'feedKey',
				],
			},
			{
				label: 'Liquidity context',
				items: [
					'marketCap',
					'volume24h',
				],
			},
			{
				label: 'Provider mapping',
				items: [
					'caip19',
					'transport',
					'providerAssetId',
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'Market_Timestamp list sorted by timestampMs',
					},
				],
			},
		],
	},
	summary: {
		value: '$market',
		title: '$market',
		after: [
			'timestampMs',
			'feedKey',
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Market_Timestamp>
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
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
