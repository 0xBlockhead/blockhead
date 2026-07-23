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
		title = 'Pyth price feed observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PythPriceFeed_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PythPriceFeed_Timestamp>
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
	entityType={EntityType.PythPriceFeed_Timestamp}
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
				publishTimeMs: true,
				price: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(pythPriceFeedTimestamps) => [...new Map(pythPriceFeedTimestamps.values.map((pythPriceFeedTimestamp) => [pythPriceFeedTimestamp[EntityMetaKey.SelectorKey], pythPriceFeedTimestamp])).values()]}
	getKey={(pythPriceFeedTimestamp) => pythPriceFeedTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Pyth price feed observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: pythPriceFeedTimestamp })}
		{@const pythPriceFeedTimestampFields = { ...pythPriceFeedTimestamp[EntityMetaKey.Selector], ...pythPriceFeedTimestamp }}
		<EntityView
			entityType={EntityType.PythPriceFeed_Timestamp}
			entitySelector={pythPriceFeedTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((pythPriceFeedTimestampFields.publishTimeMs) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((pythPriceFeedTimestampFields.price) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((pythPriceFeedTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
