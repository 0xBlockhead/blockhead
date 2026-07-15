<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.HyperliquidMarket_TimeInterval_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import HyperliquidMarket_TimeInterval_TimestampView from '$/views/HyperliquidMarket_TimeInterval_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(hyperliquidMarketTimeIntervalTimestamps)}
			{@const uniqueHyperliquidMarketTimeIntervalTimestamps = [...new Map(hyperliquidMarketTimeIntervalTimestamps.values.map((hyperliquidMarketTimeIntervalTimestamp) => [hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.SelectorKey], hyperliquidMarketTimeIntervalTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hyperliquidMarketTimeIntervalTimestamps.totalCount}
				getKey={(hyperliquidMarketTimeIntervalTimestamp) => hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHyperliquidMarketTimeIntervalTimestamps}
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
					{@const selection = select(EntityType.HyperliquidMarket_TimeInterval_Timestamp, hyperliquidMarketTimeIntervalTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<HyperliquidMarket_TimeInterval_TimestampView
						selection={selection}
						prefetched={hyperliquidMarketTimeIntervalTimestampFields}
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
		entityType={EntityType.HyperliquidMarket_TimeInterval_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
