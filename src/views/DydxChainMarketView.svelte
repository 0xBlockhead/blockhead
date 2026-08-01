<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.DydxChainMarket> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.DydxIndexer,
			Source.KingnodesDydxNode,
		],
	}))
	const dydxChainMarket = $derived(viewSelection({
		fields: {
			marketKind: true,
			baseAsset: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.ticker || 'dydx chain market')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import DydxChainMarket_TimestampsView from '$/views/DydxChainMarket_TimestampsView.svelte'
	import DydxChainNetworkView from '$/views/DydxChainNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainMarket}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={dydxChainMarket}>
			{#snippet children(entity)}
				{entity.marketKind || selection.entitySelector.ticker || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={dydxChainMarket}>
			{#snippet children(entity)}
				{@const baseAsset = entity.baseAsset}
				{#if baseAsset != null}
					<span data-text="muted">
						{baseAsset}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<DydxChainNetworkView
						selection={select(EntityType.DydxChainNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ticker</dt>
				<dd>
					{selection.entitySelector.ticker}
				</dd>
			</div>

			<ResourceBoundary
				resource={dydxChainMarket}
			>
				{#snippet children(entity)}
					{@const baseAsset = entity.baseAsset}
					{#if baseAsset != null}
						<div>
							<dt>base asset</dt>
							<dd>
								{baseAsset}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quoteAsset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quoteAsset = entity.quoteAsset}
					{#if quoteAsset != null}
						<div>
							<dt>quote asset</dt>
							<dd>
								{quoteAsset}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>market kind</dt>
				<dd>
					<ResourceBoundary
						resource={dydxChainMarket}
					>
						{#snippet children(entity)}
							{entity.marketKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<DydxChainMarket_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
