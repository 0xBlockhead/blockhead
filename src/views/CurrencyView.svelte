<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.Currency> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const currency = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.iso4217 || 'currency')
	const viewDomId = $derived('currency-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(assets)/(currencies)/currency/[iso4217=iso4217]',
				{
					iso4217: selection.entitySelector.iso4217,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={currency}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.iso4217 || (prefetched.name ?? '') || titleFallback}
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
					resource={currency}
				>
					{#snippet children(entity)}
						{@const symbol = entity.symbol}
						{#if symbol != null}
							<div>
								<dt>Symbol</dt>
								<dd>
									{symbol}
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
							viewSelection({
								fields: {
									minorUnitExponent: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.minorUnitExponent}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							catalogSortWeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const catalogSortWeight = entity.catalogSortWeight}
					{#if catalogSortWeight != null}
						<div>
							<dt>Catalog sort weight</dt>
							<dd>
								{catalogSortWeight}
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
					},
					{
						id: 'markets-with-currency-as-quote',
						label: 'Quote',
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

			{#snippet SectionMarketsWithCurrencyAsBase({ id, label, open })}
				<MarketsView
					selection={selection.$$marketsWithCurrencyAsBase}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMarketsWithCurrencyAsQuote({ id, label, open })}
				<MarketsView
					selection={selection.$$marketsWithCurrencyAsQuote}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
