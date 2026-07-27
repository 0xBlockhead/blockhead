<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidOrderbook_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hyperliquid orderbook timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidPerpMarketView from '$/views/HyperliquidPerpMarketView.svelte'
	import HyperliquidSpotPairView from '$/views/HyperliquidSpotPairView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidOrderbook_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hyperliquid orderbook timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>book key</dt>
				<dd>
					{pendingEntity.bookKey}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
									prefetched={hyperliquidPerpMarket}
									layout={EntityLayout.Value}
									open={false}
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
									prefetched={hyperliquidSpotPair}
									layout={EntityLayout.Value}
									open={false}
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
							nSigFigs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nSigFigs = entity.nSigFigs}
					{#if nSigFigs != null}
						<div>
							<dt>n sig figs</dt>
							<dd>
								{String(nSigFigs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mantissa: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mantissa = entity.mantissa}
					{#if mantissa != null}
						<div>
							<dt>mantissa</dt>
							<dd>
								{String(mantissa)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							depthLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depthLimit = entity.depthLimit}
					{#if depthLimit != null}
						<div>
							<dt>depth limit</dt>
							<dd>
								{String(depthLimit)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
