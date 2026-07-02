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
		title = 'Derivative observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Market derivative observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Market_Derivative_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market_Derivative_Timestamp>
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
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
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
					markPrice: true,
					indexPrice: true,
					fundingRate: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Derivative_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(marketDerivativeTimestamps)}
			{@const uniqueMarketDerivativeTimestamps = [...new Map(marketDerivativeTimestamps.values.map((marketDerivativeTimestamp) => [marketDerivativeTimestamp[EntityMetaKey.SelectorKey], marketDerivativeTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market_Derivative_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={marketDerivativeTimestamps.values.length === uniqueMarketDerivativeTimestamps.length && marketDerivativeTimestamps.totalCount != null && marketDerivativeTimestamps.totalCount >= uniqueMarketDerivativeTimestamps.length ? marketDerivativeTimestamps.totalCount : uniqueMarketDerivativeTimestamps.length}
				getKey={(marketDerivativeTimestamp) => marketDerivativeTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMarketDerivativeTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No market derivative observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketDerivativeTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market_Derivative_Timestamp> })}
					<Market_Derivative_TimestampView
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey]', {
								marketVenue: entity.$market.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$market.$base.kind],
								base: entity.$market.$base.kind === MarketAssetKind.Coin ? entity.$market.$base.$coin.coinId : entity.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$base.$coinInstance.type] : entity.$market.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$market.$quote.kind],
								quote: entity.$market.$quote.kind === MarketAssetKind.Coin ? entity.$market.$quote.$coin.coinId : entity.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$quote.$coinInstance.type] : entity.$market.$quote.$currency.iso4217,
								marketKind: entity.$market.marketKind,
								timestampMs: String(({ ...marketDerivativeTimestamp.entitySelector, ...marketDerivativeTimestamp }).timestampMs),
								feedKey: String(({ ...marketDerivativeTimestamp.entitySelector, ...marketDerivativeTimestamp }).feedKey),
							})
						}
						selection={select(EntityType.Market_Derivative_Timestamp, marketDerivativeTimestamp.entitySelector)}
						prefetched={marketDerivativeTimestamp}
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
		entityType={EntityType.Market_Derivative_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
