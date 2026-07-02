<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.Currency>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Currency>>
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

	const currency = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			symbol: true,
			...(open && {
				minorUnitExponent: true,
				catalogSortWeight: true,
				$$timestamps: true,
				$$marketsWithCurrencyAsBase: true,
				$$marketsWithCurrencyAsQuote: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency')
	const viewDomId = $derived('currency-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.Currency}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
			iso4217: String(({ ...selection.entitySelector, ...prefetched }).iso4217),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'}
		{:else}
			<ResourceBoundary resource={currency}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).iso4217) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'}
		{:else}
			<ResourceBoundary resource={currency}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).iso4217) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.iso4217) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
							selection[EntityProxyField]<EntityType.Currency_Timestamp>('$$timestamps', {
								sources: [
									Source.Constants_Internal,
								],
								fields: {
									marketCap: true,
									timestampMs: true,
								},
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow.entitySelector.timestampMs ?? fieldRow.timestampMs, 'desc'],
								],
							}).first()
						}
						placeholderText='Loading latest catalog snapshot...'
					>
						{#snippet Pending()}
							<span data-text="muted">-</span>
						{/snippet}

						{#snippet children(currencyTimestamp)}
							{#if currencyTimestamp != null}
								{@const currencyTimestampSelector = currencyTimestamp.entitySelector}
								<Currency_TimestampView
									selection={
										select(EntityType.Currency_Timestamp, currencyTimestampSelector, {
											sources: [
												Source.Constants_Internal,
											],
										})
									}
									href={
										resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
											iso4217: String(({ ...currencyTimestampSelector, ...currencyTimestamp }).$currency.iso4217),
											timestampMs: String(({ ...currencyTimestampSelector, ...currencyTimestamp }).timestampMs),
										})
									}
									prefetched={{ ...currencyTimestampSelector, ...currencyTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">-</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={currency}>
				{#snippet Pending()}
					{@const symbol = prefetched.symbol ?? selection.entitySelector.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const symbol = entity.symbol ?? selection.entitySelector.symbol ?? prefetched.symbol}
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Minor unit exponent</dt>
				<dd>
					<ResourceBoundary resource={currency}>
						{#snippet Pending()}
							{@const minorUnitExponent = prefetched.minorUnitExponent ?? selection.entitySelector.minorUnitExponent}
							{#if minorUnitExponent !== undefined && minorUnitExponent !== null}
								{String((minorUnitExponent) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const minorUnitExponent = entity.minorUnitExponent ?? selection.entitySelector.minorUnitExponent ?? prefetched.minorUnitExponent}
							{#if minorUnitExponent !== undefined && minorUnitExponent !== null}
								{String((minorUnitExponent) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={currency}>
				{#snippet Pending()}
					{@const catalogSortWeight = prefetched.catalogSortWeight ?? selection.entitySelector.catalogSortWeight}
					{#if catalogSortWeight !== undefined && catalogSortWeight !== null}
						<div>
							<dt>Catalog sort weight</dt>
							<dd>
								{String((catalogSortWeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const catalogSortWeight = entity.catalogSortWeight ?? selection.entitySelector.catalogSortWeight ?? prefetched.catalogSortWeight}
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
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-markets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'markets-with-currency-as-base',
							label: 'Base',
						},
						{
							id: 'markets-with-currency-as-quote',
							label: 'Quote',
						},
					]
				}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
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

				{#snippet SectionMarketsWithCurrencyAsBase({ id, label, open })}
					<MarketsView
						selection={selection[EntityProxyField]<EntityType.Market>('$$marketsWithCurrencyAsBase')}
						href={resolve('/(assets)/markets')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMarketsWithCurrencyAsQuote({ id, label, open })}
					<MarketsView
						selection={selection[EntityProxyField]<EntityType.Market>('$$marketsWithCurrencyAsQuote')}
						href={resolve('/(assets)/markets')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
