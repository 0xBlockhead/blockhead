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
		title = 'Spot stream',
		typeAnnotationParagraphs = ['A point-in-time market quote or metric observation.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Market_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
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

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				feedKey: true,
				price: true,
				timestampMs: true,
				$market: true,
				$base: true,
				$quote: true,
			},
		})
	}
	{countResource}
	getResourceItems={(marketTimestamps) => [...new Map(marketTimestamps.values.map((marketTimestamp) => [marketTimestamp[EntityMetaKey.SelectorKey], marketTimestamp])).values()]}
	getKey={(marketTimestamp) => marketTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Market observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: marketTimestamp })}
		{@const marketTimestampFields = { ...marketTimestamp[EntityMetaKey.Selector], ...marketTimestamp }}
		<EntityView
			entityType={EntityType.Market_Timestamp}
			entitySelector={marketTimestamp[EntityMetaKey.Selector]}
			href={
				(
					marketTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in marketTimestamp[EntityMetaKey.Selector]
					&& marketTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& marketTimestamp[EntityMetaKey.Selector] != null && 'feedKey' in marketTimestamp[EntityMetaKey.Selector]
					&& marketTimestamp[EntityMetaKey.Selector].feedKey != null
					&& marketTimestamp[EntityMetaKey.Selector] != null && '$market' in marketTimestamp[EntityMetaKey.Selector]
					&& marketTimestamp[EntityMetaKey.Selector].$market != null && 'marketKind' in marketTimestamp[EntityMetaKey.Selector].$market
					&& marketTimestamp[EntityMetaKey.Selector].$market.marketKind != null
					&& marketTimestamp[EntityMetaKey.Selector].$market != null && '$base' in marketTimestamp[EntityMetaKey.Selector].$market
					&& marketTimestamp[EntityMetaKey.Selector].$market.$base != null && 'assetKey' in marketTimestamp[EntityMetaKey.Selector].$market.$base
					&& marketTimestamp[EntityMetaKey.Selector].$market.$base.assetKey != null
					&& marketTimestamp[EntityMetaKey.Selector].$market != null && '$quote' in marketTimestamp[EntityMetaKey.Selector].$market
					&& marketTimestamp[EntityMetaKey.Selector].$market.$quote != null && 'assetKey' in marketTimestamp[EntityMetaKey.Selector].$market.$quote
					&& marketTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey != null
					&& marketTimestamp[EntityMetaKey.Selector].$market != null && '$marketVenue' in marketTimestamp[EntityMetaKey.Selector].$market
					&& marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue != null && 'marketVenueId' in marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue
					&& marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId != null
					&& marketTimestamp[EntityMetaKey.Selector] != null && '$base' in marketTimestamp[EntityMetaKey.Selector]
					&& marketTimestamp[EntityMetaKey.Selector].$base != null && 'kind' in marketTimestamp[EntityMetaKey.Selector].$base
					&& marketTimestamp[EntityMetaKey.Selector].$base.kind != null
					&& marketTimestamp[EntityMetaKey.Selector] != null && '$quote' in marketTimestamp[EntityMetaKey.Selector]
					&& marketTimestamp[EntityMetaKey.Selector].$quote != null && 'kind' in marketTimestamp[EntityMetaKey.Selector].$quote
					&& marketTimestamp[EntityMetaKey.Selector].$quote.kind != null ?
						resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
					timestampMs: String(marketTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					feedKey: encodeURIComponent(String(marketTimestamp[EntityMetaKey.Selector].feedKey ?? '')),
					marketKind: String(marketTimestamp[EntityMetaKey.Selector].$market.marketKind ?? ''),
					base: String(marketTimestamp[EntityMetaKey.Selector].$market.$base.assetKey ?? ''),
					quote: String(marketTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey ?? ''),
					marketVenue: String(marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId ?? ''),
					baseKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$base.kind)] ?? ''),
					quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$quote.kind)] ?? ''),
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
				{[String((marketTimestampFields.feedKey) ?? '')].filter(Boolean).join(' ') || 'market timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((marketTimestampFields.price) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((marketTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
