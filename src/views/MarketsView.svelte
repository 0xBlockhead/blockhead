<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Market>
			countResource?: SvelteKitResource<number>
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
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				marketKind: true,
				$base: true,
				$quote: true,
				$marketVenue: true,
			},
			limit: 8192,
		})
	}
	{countResource}
	getResourceItems={(markets) => [...new Map(markets.values.filter((market) => (filterMarketVenueId == null || market[EntityMetaKey.Selector].$marketVenue.marketVenueId === filterMarketVenueId) && (filterMarketKind == null || market[EntityMetaKey.Selector].marketKind === filterMarketKind)).map((market) => [market[EntityMetaKey.SelectorKey], market])).values()]}
	getKey={(market) => market[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.Market}
			entitySelector={market[EntityMetaKey.Selector]}
			href={
				(
					market[EntityMetaKey.Selector] != null && 'marketKind' in market[EntityMetaKey.Selector]
					&& market[EntityMetaKey.Selector].marketKind != null
					&& market[EntityMetaKey.Selector] != null && '$base' in market[EntityMetaKey.Selector]
					&& market[EntityMetaKey.Selector].$base != null && 'assetKey' in market[EntityMetaKey.Selector].$base
					&& market[EntityMetaKey.Selector].$base.assetKey != null
					&& market[EntityMetaKey.Selector] != null && '$quote' in market[EntityMetaKey.Selector]
					&& market[EntityMetaKey.Selector].$quote != null && 'assetKey' in market[EntityMetaKey.Selector].$quote
					&& market[EntityMetaKey.Selector].$quote.assetKey != null
					&& market[EntityMetaKey.Selector] != null && '$marketVenue' in market[EntityMetaKey.Selector]
					&& market[EntityMetaKey.Selector].$marketVenue != null && 'marketVenueId' in market[EntityMetaKey.Selector].$marketVenue
					&& market[EntityMetaKey.Selector].$marketVenue.marketVenueId != null
					&& market[EntityMetaKey.Selector].$base != null && 'kind' in market[EntityMetaKey.Selector].$base
					&& market[EntityMetaKey.Selector].$base.kind != null
					&& market[EntityMetaKey.Selector].$quote != null && 'kind' in market[EntityMetaKey.Selector].$quote
					&& market[EntityMetaKey.Selector].$quote.kind != null ?
						resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
					marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
					base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
					quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
					marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
					baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
					quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'Market'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
