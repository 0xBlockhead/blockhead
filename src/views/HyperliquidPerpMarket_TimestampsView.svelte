<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Hyperliquid perp market observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HyperliquidPerpMarket_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.HyperliquidPerpMarket_Timestamp>
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
	import HyperliquidPerpMarket_TimestampView from '$/views/HyperliquidPerpMarket_TimestampView.svelte'
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
		{#snippet children(hyperliquidPerpMarketTimestamps)}
			{@const uniqueHyperliquidPerpMarketTimestamps = [...new Map(hyperliquidPerpMarketTimestamps.values.map((hyperliquidPerpMarketTimestamp) => [hyperliquidPerpMarketTimestamp[EntityMetaKey.SelectorKey], hyperliquidPerpMarketTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HyperliquidPerpMarket_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hyperliquidPerpMarketTimestamps.totalCount}
				getKey={(hyperliquidPerpMarketTimestamp) => hyperliquidPerpMarketTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHyperliquidPerpMarketTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Hyperliquid perp market observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: hyperliquidPerpMarketTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.HyperliquidPerpMarket_Timestamp> })}
					{@const hyperliquidPerpMarketTimestampFields = { ...hyperliquidPerpMarketTimestamp[EntityMetaKey.Selector], ...hyperliquidPerpMarketTimestamp }}
					<HyperliquidPerpMarket_TimestampView
						selection={select(EntityType.HyperliquidPerpMarket_Timestamp, hyperliquidPerpMarketTimestamp[EntityMetaKey.Selector])}
						prefetched={hyperliquidPerpMarketTimestampFields}
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
		entityType={EntityType.HyperliquidPerpMarket_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
