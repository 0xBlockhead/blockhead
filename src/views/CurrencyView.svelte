<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		currencyCatalogSnapshotTimestampMs,
		Iso4217,
	} from '$/constants/Currency.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
			iso4217: selector.iso4217,
			}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Currency>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()

	const currency = subscribe(EntityType.Currency,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, symbol: true, $$timestamps: ({ sources: [
					Source.Constants_Internal,
				], limit: 1, fields: { marketCap: true } }), ...(open && ({ minorUnitExponent: true })) } }),
	)

	const idPrefix = selector.iso4217


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.Currency}
	entitySelector={selector}
	href={href}
	title={selector.iso4217}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.iso4217}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={currency}
			placeholderText="Loading currency…"
		>
			{#snippet children(currency)}
				{currency.fields.name ?? selector.iso4217}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ISO&nbsp;4217 currency used as a market quote leg (e.g. USD in `Binance:ETH-USD`).
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>FX turnover weight</dt>
				<dd>
					<ResourceBoundary
						resource={currency}
						placeholderText="Loading currency…"
					>
						{#snippet children(currency)}
							{#if currency.fields.$$timestamps?.values[0]?.marketCap !== undefined}
								<CurrencyAmount
									currency="USD"
									value={currency.fields.$$timestamps.values[0].marketCap}
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
							{#if currency.fields.symbol != null && currency.fields.symbol !== ''}
								{currency.fields.symbol}
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
								{#if currency.fields.minorUnitExponent !== undefined}
									{String(currency.fields.minorUnitExponent)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<section data-scroll-marker-label="Catalog snapshot">
			<Currency_TimestampView
				selector={{
					$currency: { iso4217: selector.iso4217 },
					timestampMs: currencyCatalogSnapshotTimestampMs,
				}}
				layout={EntityLayout.Title}
				open={false}
			/>
		</section>

		<CollapsibleTabs
			id={`${idPrefix}:carousel-markets`}
			sectionIdPrefix={idPrefix}
			sections={[
				{ id: 'markets-as-base', label: 'Base' },
				{ id: 'markets-as-quote', label: 'Quote' },
			]}
			class="currency-view-collapsible-markets"
			data-card
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

			{#snippet SectionMarketsAsBase({ id, label })}
				{#if selector.iso4217 === Iso4217.USD}
					<p data-text="muted">
						<a href={resolve('/markets')}>All catalog markets</a>
						— spot indices quote in USD.
					</p>
				{:else}
					<MarketsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/markets')}
						entityFieldReference={{
							entityType: EntityType.Currency,
							selector,
							fieldName: '$$marketsWithCurrencyAsBase',
						}}
						{id}
						title="Base"
					/>
				{/if}
			{/snippet}

			{#snippet SectionMarketsAsQuote({ id, label })}
				<MarketsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/markets')}
					entityFieldReference={{
						entityType: EntityType.Currency,
						selector,
						fieldName: '$$marketsWithCurrencyAsQuote',
					}}
					{id}
					title="Quote"
				/>
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>
