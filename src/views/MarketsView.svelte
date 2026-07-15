<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Markets',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Markets-list',
		filterMarketVenueId,
		filterMarketKind,
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Market>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
			filterMarketVenueId?: unknown
			filterMarketKind?: unknown
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		A market pairs a base asset with a quote so feeds can publish prices, volume, and related stats.
	</p>

	<p>
		Each row is a venue book with a kind: spot (CEX/DEX cash markets), perpetual (funding + open interest), or dated futures.
	</p>

	<p>
		Spot markets expose quote streams and OHLC where wired; perpetual and futures markets may include funding and open interest when a provider supplies them.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					marketKind: true,
					$base: true,
					$quote: true,
					$marketVenue: true,
				},
				limit: 8192,
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(markets)}
			{@const uniqueMarkets = [...new Map(markets.values.filter((market) => (filterMarketVenueId == null || market[EntityMetaKey.Selector].$marketVenue.marketVenueId === filterMarketVenueId) && (filterMarketKind == null || market[EntityMetaKey.Selector].marketKind === filterMarketKind)).map((market) => [market[EntityMetaKey.SelectorKey], market])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={markets.totalCount}
				getKey={(market) => market[EntityMetaKey.SelectorKey]}
				items={uniqueMarkets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Markets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: market })}
					{@const marketFields = { ...market[EntityMetaKey.Selector], ...market }}
					{@const selection = select(EntityType.Market, market[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const marketHrefFields = { ...market, ...market[EntityMetaKey.Selector] }}
					<MarketView
						selection={selection}
						prefetched={marketFields}
						href={
							(marketHrefFields.marketKind !== undefined && marketHrefFields.$base !== undefined && marketHrefFields.$base.assetKey !== undefined && marketHrefFields.$quote !== undefined && marketHrefFields.$quote.assetKey !== undefined && marketHrefFields.$marketVenue !== undefined && marketHrefFields.$marketVenue.marketVenueId !== undefined && marketHrefFields.$base.kind !== undefined && marketHrefFields.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(marketHrefFields.marketKind ?? ''),
								base: String(marketHrefFields.$base.assetKey ?? ''),
								quote: String(marketHrefFields.$quote.assetKey ?? ''),
								marketVenue: String(marketHrefFields.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketHrefFields.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketHrefFields.$quote.kind)] ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.Market}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
