<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Coin> = $props()

	const coinLatestResource1 = $derived(
		selection
			.$$timestamps({
				sources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_Rest,
				],
				fields: {
					marketCapRank: true,
					marketCapUsd: true,
					marketCap: true,
					change24hPercent: true,
					timestampMs: true,
					source: true,
				},
				limit: 1,
				orderBy: [
					[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
				],
			})
	)

	const coin = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived([(prefetched.symbol ?? ''), (prefetched.name ?? '')].filter(Boolean).join(' ') || 'Coin')
	const viewDomId = $derived('coin-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
	import EvmCoinInstancesView from '$/views/EvmCoinInstancesView.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(assets)/coin/[coinId=stringSegment]',
				{
					coinId: selection.entitySelector.coinId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={coin}>
			{#snippet children(entity)}
				{@const reference = entity.$logo}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={coin}>
			{#snippet Pending()}
				{selection.entitySelector.coinId}
			{/snippet}

			{#snippet children(entity)}
				{entity.name && entity.symbol && entity.name !== entity.symbol ? `${entity.name} (${entity.symbol})` : entity.symbol || entity.name || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{selection.entitySelector.coinId}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A catalog coin identity groups time-stamped fundamentals snapshots and market quote streams for the same asset so duplicate tickers from rival data vendors stay separable by catalog key and vendor attribution.
		</p>

		<p>
			Each <strong>coin instance</strong>
			row is anchored on one execution chain—either the native gas asset or a token contract—while sharing the same catalog coin id across networks.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest snapshot</dt>
				<dd>
					<ResourceBoundary
						resource={coinLatestResource1}
					>
						{#snippet children(coinTimestamps)}
							{@const coinTimestamp = coinTimestamps.values[0]}
							{#if coinTimestamp != null}
								<Coin_TimestampView
									selection={
										select(EntityType.Coin_Timestamp, coinTimestamp[EntityMetaKey.Selector], {
											sources: [
												Source.Constants_Internal,
												Source.Coingecko_Rest,
												Source.CoinMarketCap_Rest,
												Source.Coinpaprika_Rest,
											],
										})
									}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest snapshot available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if !contentOpen}
				<div>
					<dt>Coin ID</dt>
					<dd>
						{selection.entitySelector.coinId}
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-availability'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'coin-instances',
						label: 'Instances',
					},
					{
						id: 'coin-bridge-capabilities',
						label: 'Bridge capabilities',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Availability</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCoinInstances({ id, label })}
				<EvmCoinInstancesView
					selection={selection.$$coinInstances}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCoinBridgeCapabilities({ id, label })}
				<CoinBridgeCapabilitiesView
					selection={selection.$$bridgeCapabilities}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-markets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'catalog-usd-market',
						label: 'USD market',
					},
					{
						id: 'markets-with-coin-as-base',
						label: 'Base markets',
					},
					{
						id: 'markets-with-coin-as-quote',
						label: 'Quote markets',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Markets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCatalogUsdMarket({ id, label })}
				<MarketsView
					selection={
						selection
						.$$marketsWithCoinAsBase({
							sources: [
								Source.Constants_Internal,
							],
							limit: 1,
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMarketsWithCoinAsBase({ id, label })}
				<MarketsView
					selection={
						selection
						.$$marketsWithCoinAsBase({
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMarketsWithCoinAsQuote({ id, label })}
				<MarketsView
					selection={
						selection
						.$$marketsWithCoinAsQuote({
							limit: 16,
						})
					}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
