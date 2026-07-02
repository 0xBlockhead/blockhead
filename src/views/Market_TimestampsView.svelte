<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Spot stream',
		typeAnnotationParagraphs = ['A point-in-time market quote or metric observation.'],
		placeholderText = 'Loading Market observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					feedKey: true,
					price: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(marketTimestamps)}
			{@const uniqueMarketTimestamps = [...new Map(marketTimestamps.values.map((marketTimestamp) => [marketTimestamp[EntityMetaKey.SelectorKey], marketTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={marketTimestamps.values.length === uniqueMarketTimestamps.length && marketTimestamps.totalCount != null && marketTimestamps.totalCount >= uniqueMarketTimestamps.length ? marketTimestamps.totalCount : uniqueMarketTimestamps.length}
				getKey={(marketTimestamp) => marketTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMarketTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No market observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_Timestamp> })}
					<Market_TimestampView
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
								marketVenue: entity.$market.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$market.$base.kind],
								base: entity.$market.$base.kind === MarketAssetKind.Coin ? entity.$market.$base.$coin.coinId : entity.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$base.$coinInstance.type] : entity.$market.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$market.$quote.kind],
								quote: entity.$market.$quote.kind === MarketAssetKind.Coin ? entity.$market.$quote.$coin.coinId : entity.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$quote.$coinInstance.type] : entity.$market.$quote.$currency.iso4217,
								marketKind: entity.$market.marketKind,
								timestampMs: String(({ ...marketTimestamp.entitySelector, ...marketTimestamp }).timestampMs),
								feedKey: String(({ ...marketTimestamp.entitySelector, ...marketTimestamp }).feedKey),
							})
						}
						selection={select(EntityType.Market_Timestamp, marketTimestamp.entitySelector)}
						prefetched={marketTimestamp}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.Market_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
