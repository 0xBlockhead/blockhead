<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.Currency> = $props()

	const currencyLatestResource1 = $derived(
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
	)

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
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
		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						name: true,
						symbol: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.iso4217 || (prefetched.name ?? '') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Catalog snapshot</dt>
				<dd>
					<ResourceBoundary
						resource={currencyLatestResource1}
					>
						{#snippet children(currencyTimestamps)}
							{@const currencyTimestamp = currencyTimestamps.values[0]}
							{#if currencyTimestamp != null}
								<Currency_TimestampView
									selection={
										select(EntityType.Currency_Timestamp, currencyTimestamp[EntityMetaKey.Selector], {
											sources: [
												Source.Constants_Internal,
											],
										})
									}
									layout={EntityLayout.Value}
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
						viewSelection({
							fields: {
								name: true,
								symbol: true,
							},
						})
					}
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

	{#snippet Details()}
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
					<Tooltip>
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

			{#snippet SectionMarketsWithCurrencyAsBase({ id, label })}
				<MarketsView
					selection={selection.$$marketsWithCurrencyAsBase}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMarketsWithCurrencyAsQuote({ id, label })}
				<MarketsView
					selection={selection.$$marketsWithCurrencyAsQuote}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
