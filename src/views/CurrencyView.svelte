<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		currencyCatalogSnapshotTimestampMs,
		Iso4217,
	} from '$/constants/Currency.ts'

	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
		'/(assets)/(currencies)/currency/[iso4217]',
		{ iso4217: entityId.iso4217 },
	),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Currency>
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const currency = useEntity(
		EntityType.Currency,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			$$timestamps: {
				$: [
					Source.Constants_Internal,
				],
				$limit: 1,
				marketCap: {},
			},
			...(open && {
				symbol: {},
				minorUnitExponent: {},
			}),
		},
	)

	const idPrefix = entityId.iso4217


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
</script>


<EntityView
	entityType={EntityType.Currency}
	{entityId}
	href={href}
	title={currency.name ?? entityId.iso4217}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.iso4217}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={currency}
			placeholderText="Loading currency…"
		>
			{#snippet children(currency)}
				{currency.name ?? entityId.iso4217}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			ISO&nbsp;4217 currency used as a market quote leg (e.g. USD in `Binance:ETH-USD`).
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>FX turnover weight</dt>
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

	{#snippet Details({ open: _detailsOpen })}
		<section data-scroll-marker-label="Catalog snapshot">
			<Currency_TimestampView
				entityId={{
					$currency: { iso4217: entityId.iso4217 },
					timestampMs: currencyCatalogSnapshotTimestampMs,
				}}
				id={`${idPrefix}:catalog-snapshot`}
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
					{#if entityId.iso4217 === Iso4217.USD}
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
								entityId,
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
							entityId,
							fieldName: '$$marketsWithCurrencyAsQuote',
						}}
						{id}
						title="Quote"
					/>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
