<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.DydxChainMarket>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.DydxChainMarket>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const dydxChainMarket = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			marketKind: true,
			baseAsset: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			marketKind: true,
			baseAsset: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.ticker) ?? '')].filter(Boolean).join(' ') || 'dydx chain market')
	const viewDomId = $derived('dydx-chain-market-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import DydxChainMarket_TimestampsView from '$/views/DydxChainMarket_TimestampsView.svelte'
	import DydxChainNetworkView from '$/views/DydxChainNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainMarket}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'marketKind') && Object.hasOwn(prefetched, 'baseAsset')}
			{[String((pendingEntity.ticker) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={dydxChainMarket}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.ticker) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'marketKind') && Object.hasOwn(prefetched, 'baseAsset')}
			{[String((pendingEntity.marketKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.ticker) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={dydxChainMarket}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.marketKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.ticker) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'marketKind') && Object.hasOwn(prefetched, 'baseAsset')}
			{@const baseAsset0 = pendingEntity.baseAsset}
			{#if baseAsset0 !== undefined && baseAsset0 !== null}
				<span data-text="muted">
					{String((baseAsset0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={dydxChainMarket}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseAsset0 = resolvedEntity.baseAsset}
					{#if baseAsset0 !== undefined && baseAsset0 !== null}
						<span data-text="muted">
							{String((baseAsset0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<DydxChainNetworkView
						selection={select(EntityType.DydxChainNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ticker</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ticker: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ticker = resolvedEntity.ticker}
							{#if ticker !== undefined && ticker !== null}
								{String((ticker) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							baseAsset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseAsset = resolvedEntity.baseAsset}
					{#if baseAsset !== undefined && baseAsset !== null}
						<div>
							<dt>base asset</dt>
							<dd>
								{String((baseAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quoteAsset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteAsset = resolvedEntity.quoteAsset}
					{#if quoteAsset !== undefined && quoteAsset !== null}
						<div>
							<dt>quote asset</dt>
							<dd>
								{String((quoteAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>market kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									marketKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const marketKind = resolvedEntity.marketKind}
							{#if marketKind !== undefined && marketKind !== null}
								{String((marketKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const dydxChainMarketDydxChainMarketTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={dydxChainMarketDydxChainMarketTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<DydxChainMarket_TimestampsView
					selection={dydxChainMarketDydxChainMarketTimestampsViewTimestampsResource}
					countResource={dydxChainMarketDydxChainMarketTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='DydxChainMarket_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
