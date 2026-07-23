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
		title = 'Derivative observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_Derivative_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Market_Derivative_Timestamp>
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
	entityType={EntityType.Market_Derivative_Timestamp}
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
				markPrice: true,
				indexPrice: true,
				fundingRate: true,
				timestampMs: true,
				$market: true,
				$base: true,
				$quote: true,
			},
		})
	}
	{countResource}
	getResourceItems={(marketDerivativeTimestamps) => [...new Map(marketDerivativeTimestamps.values.map((marketDerivativeTimestamp) => [marketDerivativeTimestamp[EntityMetaKey.SelectorKey], marketDerivativeTimestamp])).values()]}
	getKey={(marketDerivativeTimestamp) => marketDerivativeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Market derivative observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: marketDerivativeTimestamp })}
		{@const marketDerivativeTimestampFields = { ...marketDerivativeTimestamp[EntityMetaKey.Selector], ...marketDerivativeTimestamp }}
		<EntityView
			entityType={EntityType.Market_Derivative_Timestamp}
			entitySelector={marketDerivativeTimestamp[EntityMetaKey.Selector]}
			href={
				(
					marketDerivativeTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in marketDerivativeTimestamp[EntityMetaKey.Selector]
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector] != null && 'feedKey' in marketDerivativeTimestamp[EntityMetaKey.Selector]
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].feedKey != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector] != null && '$market' in marketDerivativeTimestamp[EntityMetaKey.Selector]
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market != null && 'marketKind' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.marketKind != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market != null && '$base' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$base != null && 'assetKey' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$base
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$base.assetKey != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market != null && '$quote' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$quote != null && 'assetKey' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$quote
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market != null && '$marketVenue' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$marketVenue != null && 'marketVenueId' in marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$marketVenue
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector] != null && '$base' in marketDerivativeTimestamp[EntityMetaKey.Selector]
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$base != null && 'kind' in marketDerivativeTimestamp[EntityMetaKey.Selector].$base
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$base.kind != null
					&& marketDerivativeTimestamp[EntityMetaKey.Selector] != null && '$quote' in marketDerivativeTimestamp[EntityMetaKey.Selector]
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$quote != null && 'kind' in marketDerivativeTimestamp[EntityMetaKey.Selector].$quote
					&& marketDerivativeTimestamp[EntityMetaKey.Selector].$quote.kind != null ?
						resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
					timestampMs: String(marketDerivativeTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					feedKey: encodeURIComponent(String(marketDerivativeTimestamp[EntityMetaKey.Selector].feedKey ?? '')),
					marketKind: String(marketDerivativeTimestamp[EntityMetaKey.Selector].$market.marketKind ?? ''),
					base: String(marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$base.assetKey ?? ''),
					quote: String(marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$quote.assetKey ?? ''),
					marketVenue: String(marketDerivativeTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId ?? ''),
					baseKind: String(marketAssetRouteLabelByKind[String(marketDerivativeTimestamp[EntityMetaKey.Selector].$base.kind)] ?? ''),
					quoteKind: String(marketAssetRouteLabelByKind[String(marketDerivativeTimestamp[EntityMetaKey.Selector].$quote.kind)] ?? ''),
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
				{[String((marketDerivativeTimestampFields.feedKey) ?? '')].filter(Boolean).join(' ') || 'market derivative timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((marketDerivativeTimestampFields.markPrice) ?? ''), String((marketDerivativeTimestampFields.indexPrice) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((marketDerivativeTimestampFields.fundingRate) ?? '') ? String((marketDerivativeTimestampFields.fundingRate) ?? '') + '%' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
