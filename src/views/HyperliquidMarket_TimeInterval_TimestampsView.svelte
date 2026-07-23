<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Hyperliquid market time interval observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HyperliquidMarket_TimeInterval_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.HyperliquidMarket_TimeInterval_Timestamp>
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
	entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	{countResource}
	getResourceItems={(hyperliquidMarketTimeIntervalTimestamps) => [...new Map(hyperliquidMarketTimeIntervalTimestamps.values.map((hyperliquidMarketTimeIntervalTimestamp) => [hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.SelectorKey], hyperliquidMarketTimeIntervalTimestamp])).values()]}
	getKey={(hyperliquidMarketTimeIntervalTimestamp) => hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hyperliquid market time interval observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hyperliquidMarketTimeIntervalTimestamp })}
		{@const hyperliquidMarketTimeIntervalTimestampFields = { ...hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.Selector], ...hyperliquidMarketTimeIntervalTimestamp }}
		<EntityView
			entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
			entitySelector={hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'hyperliquid market time interval timestamp'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
