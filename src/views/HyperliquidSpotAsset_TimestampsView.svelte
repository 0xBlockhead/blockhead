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
		title = 'Hyperliquid spot asset observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HyperliquidSpotAsset_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.HyperliquidSpotAsset_Timestamp>
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
	import HyperliquidSpotAsset_TimestampView from '$/views/HyperliquidSpotAsset_TimestampView.svelte'
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
				entityType={EntityType.HyperliquidSpotAsset_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(hyperliquidSpotAssetTimestamps)}
			{@const uniqueHyperliquidSpotAssetTimestamps = [...new Map(hyperliquidSpotAssetTimestamps.values.map((hyperliquidSpotAssetTimestamp) => [hyperliquidSpotAssetTimestamp[EntityMetaKey.SelectorKey], hyperliquidSpotAssetTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.HyperliquidSpotAsset_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={hyperliquidSpotAssetTimestamps.totalCount}
				getKey={(hyperliquidSpotAssetTimestamp) => hyperliquidSpotAssetTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueHyperliquidSpotAssetTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Hyperliquid spot asset observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: hyperliquidSpotAssetTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.HyperliquidSpotAsset_Timestamp> })}
					{@const hyperliquidSpotAssetTimestampFields = { ...hyperliquidSpotAssetTimestamp[EntityMetaKey.Selector], ...hyperliquidSpotAssetTimestamp }}
					<HyperliquidSpotAsset_TimestampView
						selection={select(EntityType.HyperliquidSpotAsset_Timestamp, hyperliquidSpotAssetTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={hyperliquidSpotAssetTimestampFields}
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
		entityType={EntityType.HyperliquidSpotAsset_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
