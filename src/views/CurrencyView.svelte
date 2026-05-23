<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		currencyByIso4217,
		currencyTimestampEntityId,
		Iso4217,
	} from '$/constants/Currency.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Currency>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'title'
			| 'open'
			| 'layout'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const currency = useEntity(
		EntityType.Currency,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			$$timestamps: {
				$: [
					Source.Constants_Internal,
				],
				$limit: 1,
				marketCap: {},
			},
			...(open && {
				name: {},
				symbol: {},
				minorUnitExponent: {},
			}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'


	const idPrefix = entityId.iso4217
</script>


<EntityView
	entityType={EntityType.Currency}
	{entityId}
	{href}
	title={currencyByIso4217[entityId.iso4217].name}
	{layout}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<span>
			{entityId.iso4217}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		{currencyByIso4217[entityId.iso4217].name}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ISO&nbsp;4217 currency used as a market quote leg (e.g. USD in `Binance:ETH-USD`).
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>FX turnover weight (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={currency}
						placeholderText="Loading currency…"
					>
						{#snippet children(currency)}
							{#if currency.$$timestamps?.[0]?.marketCap !== undefined}
								<CurrencyAmount
									currency="USD"
									value={currency.$$timestamps[0].marketCap}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={currency}
						placeholderText="Loading currency…"
					>
						{#snippet children(currency)}
							{#if currency.symbol != null && currency.symbol !== ''}
								{currency.symbol}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Minor unit exponent</dt>
					<dd>
						<ResourceBoundary
							resource={currency}
							placeholderText="Loading currency…"
						>
							{#snippet children(currency)}
								{#if currency.minorUnitExponent !== undefined}
									{String(currency.minorUnitExponent)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Currency}
			{entityId}
		/>

		<section data-scroll-marker-label="Catalog snapshot">
			<Currency_TimestampView
				entityId={currencyTimestampEntityId(entityId.iso4217)}
				{href}
				id={`${idPrefix}:catalog-snapshot`}
				layout={EntityLayout.Title}
				open={false}
				showTypeAnnotation={false}
			/>
		</section>

		<div
			class="currency-view-carousel-groups entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idPrefix}:carousel-markets`}
				class="currency-view-collapsible-markets"
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Markets
						</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									Markets where this currency is the base or quote leg. Open a row for spot quotes and OHLC on the market page.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Markets and pricing"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Base"
						href={`#${idPrefix}:markets-as-base`}
					>Base</a>
					<a
						data-scroll-marker-label="Quote"
						href={`#${idPrefix}:markets-as-quote`}
					>Quote</a>
				{/snippet}

				{#snippet body({ open: _detailsOpen })}
					{#if entityId.iso4217 === Iso4217.USD}
						<p data-text="muted">
							<a href={resolve('/markets')}>All catalog markets</a>
							— spot indices quote in USD.
						</p>
					{/if}

					<section data-scroll-marker-label="Base">
						<MarketsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Currency,
								entityId,
								fieldName: '$$marketsWithCurrencyAsBase',
							}}
							{href}
							id={`${idPrefix}:markets-as-base`}
							title="Base"
						/>
					</section>

					<section data-scroll-marker-label="Quote">
						<MarketsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Currency,
								entityId,
								fieldName: '$$marketsWithCurrencyAsQuote',
							}}
							{href}
							id={`${idPrefix}:markets-as-quote`}
							title="Quote"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
