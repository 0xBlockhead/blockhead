<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.Currency>>
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
	const currency = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			symbol: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency')
	const viewDomId = $derived('currency-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]', {
			iso4217: String(pendingEntity.iso4217 ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={currency}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={currency}>
			{#snippet Pending()}
				{[String((pendingEntity.iso4217) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'currency'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.iso4217) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
							selection.$$timestamps({
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
						{#snippet Pending()}{/snippet}

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
										(currencyTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && currencyTimestamp[EntityMetaKey.Selector].$currency !== undefined && currencyTimestamp[EntityMetaKey.Selector].$currency.iso4217 !== undefined ? resolve('/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
											timestampMs: String(currencyTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											iso4217: String(currencyTimestamp[EntityMetaKey.Selector].$currency.iso4217 ?? ''),
										}) : undefined)
									}
									prefetched={{ ...currencyTimestampSelector, ...currencyTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							fields: {
								symbol: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const symbol = pendingEntity.symbol}
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
								fields: {
									minorUnitExponent: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const minorUnitExponent = pendingEntity.minorUnitExponent}
							{#if minorUnitExponent !== undefined && minorUnitExponent !== null}
								{String((minorUnitExponent) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							catalogSortWeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const catalogSortWeight = pendingEntity.catalogSortWeight}
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
						selection={
							selection.$$marketsWithCurrencyAsBase({
								sources: [
									Source.Constants_Internal,
								],
								count: true,
							})
						}
						href={resolve('/markets')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMarketsWithCurrencyAsQuote({ id, label, open })}
					<MarketsView
						selection={
							selection.$$marketsWithCurrencyAsQuote({
								sources: [
									Source.Constants_Internal,
								],
								count: true,
							})
						}
						href={resolve('/markets')}
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
