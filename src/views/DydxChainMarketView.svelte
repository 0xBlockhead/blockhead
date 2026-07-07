<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainMarket>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DydxChainMarket>>
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
	const dydxChainMarket = $derived(selection({
		sources: [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
		fields: {
			marketKind: true,
			baseAsset: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.ticker ?? prefetched.ticker) ?? '')].filter(Boolean).join(' ') || 'dydx chain market')
	const viewDomId = $derived('dydx-chain-market-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={dydxChainMarket}>
			{#snippet Pending()}
				{[String((selection.entitySelector.ticker ?? prefetched.ticker) ?? '')].filter(Boolean).join(' ') || title || 'dydx chain market'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.ticker) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dydxChainMarket}>
			{#snippet Pending()}
				{[String((prefetched.marketKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.ticker ?? prefetched.ticker) ?? '')].filter(Boolean).join(' ') || title || 'dydx chain market'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.marketKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.ticker) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={dydxChainMarket}>
			{#snippet Pending()}
				{@const baseAsset0 = prefetched.baseAsset}
				{#if baseAsset0 !== undefined && baseAsset0 !== null}
					<span data-text="muted">
						{String((baseAsset0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<DydxChainNetworkView
						selection={select(EntityType.DydxChainNetwork, selection.entitySelector.$network, {})}
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
								fields: {
									ticker: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ticker = selection.entitySelector.ticker ?? prefetched.ticker}
							{#if ticker !== undefined && ticker !== null}
								{String((ticker) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							baseAsset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseAsset = prefetched.baseAsset}
					{#if baseAsset !== undefined && baseAsset !== null}
						<div>
							<dt>base asset</dt>
							<dd>
								{String((baseAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							quoteAsset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quoteAsset = prefetched.quoteAsset}
					{#if quoteAsset !== undefined && quoteAsset !== null}
						<div>
							<dt>quote asset</dt>
							<dd>
								{String((quoteAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									marketKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const marketKind = prefetched.marketKind}
							{#if marketKind !== undefined && marketKind !== null}
								{String((marketKind) ?? '')}
							{/if}
						{/snippet}

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
		{#if detailsOpen}
			<DydxChainMarket_TimestampsView
				selection={selection[EntityProxyField]<EntityType.DydxChainMarket_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No dYdX market observations.'
				id='DydxChainMarket_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
