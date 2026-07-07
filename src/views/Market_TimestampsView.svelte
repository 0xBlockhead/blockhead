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
	import { marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Spot stream',
		typeAnnotationParagraphs = ['A point-in-time market quote or metric observation.'],
		placeholderText,
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
			selection({
				fields: {
					feedKey: true,
					price: true,
					timestampMs: true,
					$market: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={marketTimestamps.totalCount}
				getKey={(marketTimestamp) => marketTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMarketTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Market observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_Timestamp> })}
					{@const marketTimestampFields = { ...marketTimestamp[EntityMetaKey.Selector], ...marketTimestamp }}
					{@const marketTimestampHrefFields = { ...marketTimestamp, ...marketTimestamp[EntityMetaKey.Selector] }}
					<Market_TimestampView
						selection={select(EntityType.Market_Timestamp, marketTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={marketTimestampFields}
						href={
							(marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$marketVenue !== undefined && marketTimestampHrefFields.$market.$marketVenue.marketVenueId !== undefined && marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$base !== undefined && marketTimestampHrefFields.$market.$base.kind !== undefined && (marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$base !== undefined && marketTimestampHrefFields.$market.$base.kind !== undefined && (marketTimestampHrefFields.$market.$base.kind === 'Coin' ? marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$base !== undefined && marketTimestampHrefFields.$market.$base.$coin !== undefined && marketTimestampHrefFields.$market.$base.$coin.coinId !== undefined : marketTimestampHrefFields.$market.$base.kind === 'CoinInstance' ? marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$base !== undefined && marketTimestampHrefFields.$market.$base.$coinInstance !== undefined && marketTimestampHrefFields.$market.$base.$coinInstance.type !== undefined : marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$base !== undefined && marketTimestampHrefFields.$market.$base.$currency !== undefined && marketTimestampHrefFields.$market.$base.$currency.iso4217 !== undefined)) && marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$quote !== undefined && marketTimestampHrefFields.$market.$quote.kind !== undefined && (marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$quote !== undefined && marketTimestampHrefFields.$market.$quote.kind !== undefined && (marketTimestampHrefFields.$market.$quote.kind === 'Coin' ? marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$quote !== undefined && marketTimestampHrefFields.$market.$quote.$coin !== undefined && marketTimestampHrefFields.$market.$quote.$coin.coinId !== undefined : marketTimestampHrefFields.$market.$quote.kind === 'CoinInstance' ? marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$quote !== undefined && marketTimestampHrefFields.$market.$quote.$coinInstance !== undefined && marketTimestampHrefFields.$market.$quote.$coinInstance.type !== undefined : marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.$quote !== undefined && marketTimestampHrefFields.$market.$quote.$currency !== undefined && marketTimestampHrefFields.$market.$quote.$currency.iso4217 !== undefined)) && marketTimestampHrefFields.$market !== undefined && marketTimestampHrefFields.$market.marketKind !== undefined && marketTimestampHrefFields.timestampMs !== undefined && marketTimestampHrefFields.feedKey !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
								marketVenue: String(marketTimestampHrefFields.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketTimestampHrefFields.$market.$base.kind)] ?? ''),
								base: String((marketTimestampHrefFields.$market.$base.kind === 'Coin' ? marketTimestampHrefFields.$market.$base.$coin.coinId : marketTimestampHrefFields.$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketTimestampHrefFields.$market.$base.$coinInstance.type)] : marketTimestampHrefFields.$market.$base.$currency.iso4217)),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestampHrefFields.$market.$quote.kind)] ?? ''),
								quote: String((marketTimestampHrefFields.$market.$quote.kind === 'Coin' ? marketTimestampHrefFields.$market.$quote.$coin.coinId : marketTimestampHrefFields.$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketTimestampHrefFields.$market.$quote.$coinInstance.type)] : marketTimestampHrefFields.$market.$quote.$currency.iso4217)),
								marketKind: String(marketTimestampHrefFields.$market.marketKind ?? ''),
								timestampMs: String(marketTimestampHrefFields.timestampMs ?? ''),
								feedKey: String(marketTimestampHrefFields.feedKey ?? ''),
							}) : undefined)
						}
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
