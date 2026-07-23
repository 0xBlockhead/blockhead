<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.Currency>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Currency>
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
	const currency = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			name: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			name: true,
			symbol: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency')
	const viewDomId = $derived('currency-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.Currency}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'iso4217' in selection.entitySelector
			&& selection.entitySelector.iso4217 != null ?
				resolve('/currency/[iso4217=iso4217]', {
			iso4217: String(selection.entitySelector.iso4217 ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={currency}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name')}
			{[String((pendingEntity.iso4217) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={currency}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.iso4217) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A currency unit used for quoting values, balances, and market data.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Catalog snapshot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
								.$$timestamps({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										marketCap: true,
										timestampMs: true,
									},
									limit: 1,
									orderBy: [
										[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
									],
								})
						}
					>
						{#snippet children(currencyTimestamps)}
							{@const currencyTimestamp = currencyTimestamps.values[0]}
							{#if currencyTimestamp != null}
								{@const currencyTimestampSelector = currencyTimestamp[EntityMetaKey.Selector]}
								<Currency_TimestampView
									selection={
										select(EntityType.Currency_Timestamp, currencyTimestampSelector, {
											sources: [
												Source.Constants_Internal,
											],
										})
									}
									href={
										(
											currencyTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in currencyTimestamp[EntityMetaKey.Selector]
											&& currencyTimestamp[EntityMetaKey.Selector].timestampMs != null
											&& currencyTimestamp[EntityMetaKey.Selector] != null && '$currency' in currencyTimestamp[EntityMetaKey.Selector]
											&& currencyTimestamp[EntityMetaKey.Selector].$currency != null && 'iso4217' in currencyTimestamp[EntityMetaKey.Selector].$currency
											&& currencyTimestamp[EntityMetaKey.Selector].$currency.iso4217 != null ?
												resolve('/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
											timestampMs: String(currencyTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											iso4217: String(currencyTimestamp[EntityMetaKey.Selector].$currency.iso4217 ?? ''),
										})
										:
												undefined
										)
									}
									prefetched={{ ...currencyTimestampSelector, ...currencyTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No catalog snapshot available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if !contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								symbol: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const symbol = resolvedEntity.symbol}
						{#if symbol !== undefined && symbol !== null}
							<div>
								<dt>Symbol</dt>
								<dd>
									{String((symbol) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Minor unit exponent</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									minorUnitExponent: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const minorUnitExponent = resolvedEntity.minorUnitExponent}
							{#if minorUnitExponent !== undefined && minorUnitExponent !== null}
								{String((minorUnitExponent) ?? '')}
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
							catalogSortWeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const catalogSortWeight = resolvedEntity.catalogSortWeight}
					{#if catalogSortWeight !== undefined && catalogSortWeight !== null}
						<div>
							<dt>Catalog sort weight</dt>
							<dd>
								{String((catalogSortWeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				<CollapsibleTabs
					id={viewDomId + '-carousel-markets'}
					sectionIdPrefix={viewDomId}
					sections={
						[
							{
								id: 'markets-with-currency-as-base',
								label: 'Base',
								ownsSection: true,
							},
							{
								id: 'markets-with-currency-as-quote',
								label: 'Quote',
								ownsSection: true,
							},
						]
					}
					data-card
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Markets</HeadingComponent>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Markets where this currency is the base or quote leg.
									</p>
								{/snippet}

								<abbr
									class="entity-heading-tip"
									aria-label='Markets help'
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet MarkerMarketsWithCurrencyAsBase(_context, Content)}
						{@const marketsWithCurrencyAsBaseResource = selection
		.$$marketsWithCurrencyAsBase({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCurrencyAsBaseResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionMarketsWithCurrencyAsBase({ id, label, open, active })}
						{@const marketsWithCurrencyAsBaseResource = selection
		.$$marketsWithCurrencyAsBase({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCurrencyAsBaseResource}
						>
							{#snippet children(market)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketsView
										selection={marketsWithCurrencyAsBaseResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet MarkerMarketsWithCurrencyAsQuote(_context, Content)}
						{@const marketsWithCurrencyAsQuoteResource = selection
		.$$marketsWithCurrencyAsQuote({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCurrencyAsQuoteResource}
						>
							{#snippet children(_resolved)}
								{@render Content()}
							{/snippet}

							{#snippet PendingContent()}
								{@render Content()}
							{/snippet}

							{#snippet FailedContent(_error, _retry)}
								{@render Content()}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionMarketsWithCurrencyAsQuote({ id, label, open, active })}
						{@const marketsWithCurrencyAsQuoteResource = selection
		.$$marketsWithCurrencyAsQuote({
			sources: [
				Source.Constants_Internal,
			],
		})}
						<ResourceBoundary
							resource={marketsWithCurrencyAsQuoteResource}
						>
							{#snippet children(market)}
								<section
									id={id}
									aria-labelledby={`${id}:marker`}
									data-scroll-marker-label={label}
									data-column-item="flexible"
									data-column
									data-active={active}
								>
									<MarketsView
										selection={marketsWithCurrencyAsQuoteResource}
										CollapsibleProps={{ canToggle: false }}
										collapsible={false}
										data-column-item="flexible"
										data-card
										data-scroll-container
										open={open}
										title={label}
										id={`${id}-list`}
									/>
								</section>
							{/snippet}

							{#snippet Pending()}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
									</article>
								</section>
							{/snippet}

							{#snippet Failed(_error, _retry)}
								<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
									<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
										<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
									</article>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}

				</CollapsibleTabs>
	{/snippet}
</EntityView>
