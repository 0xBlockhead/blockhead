<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidMarket_TimeInterval_Timestamp>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidPerpMarketView from '$/views/HyperliquidPerpMarketView.svelte'
	import HyperliquidSpotPairView from '$/views/HyperliquidSpotPairView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/market/[marketKey=stringSegment]/interval/[intervalValue=nonNegativeInteger]/[intervalUnit=stringSegment]/observations/[timestampMs=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					marketKey: selection.entitySelector.marketKey,
					intervalValue: String(selection.entitySelector.timeInterval.value),
					intervalUnit: selection.entitySelector.timeInterval.unit,
					timestampMs: String(selection.entitySelector.timestampMs),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>market key</dt>
				<dd>
					{selection.entitySelector.marketKey}
				</dd>
			</div>

			<div>
				<dt>time interval</dt>
				<dd>
					{`${selection.entitySelector.timeInterval.value}${selection.entitySelector.timeInterval.unit}`}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$perpMarket}
			>
				{#snippet children(hyperliquidPerpMarket)}
					{#if hyperliquidPerpMarket != null}
						<div>
							<dt>perp market</dt>
							<dd>
								<HyperliquidPerpMarketView
									selection={select(EntityType.HyperliquidPerpMarket, hyperliquidPerpMarket[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$spotPair}
			>
				{#snippet children(hyperliquidSpotPair)}
					{#if hyperliquidSpotPair != null}
						<div>
							<dt>spot pair</dt>
							<dd>
								<HyperliquidSpotPairView
									selection={select(EntityType.HyperliquidSpotPair, hyperliquidSpotPair[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							open: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const open = entity.open}
					{#if open != null}
						<div>
							<dt>open</dt>
							<dd>
								{open}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							high: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const high = entity.high}
					{#if high != null}
						<div>
							<dt>high</dt>
							<dd>
								{high}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							low: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const low = entity.low}
					{#if low != null}
						<div>
							<dt>low</dt>
							<dd>
								{low}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							close: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const close = entity.close}
					{#if close != null}
						<div>
							<dt>close</dt>
							<dd>
								{close}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							volume: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const volume = entity.volume}
					{#if volume != null}
						<div>
							<dt>volume</dt>
							<dd>
								{volume}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tradeCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tradeCount = entity.tradeCount}
					{#if tradeCount != null}
						<div>
							<dt>trade count</dt>
							<dd>
								{tradeCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
