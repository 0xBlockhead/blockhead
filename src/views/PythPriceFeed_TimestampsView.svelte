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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PythPriceFeed_Timestamp>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import PythPriceFeed_TimestampView from '$/views/PythPriceFeed_TimestampView.svelte'
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
		{@const selection = select(EntityType.PythPriceFeed_Timestamp, pythPriceFeedTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<PythPriceFeed_TimestampView
			selection={selection}
			prefetched={pythPriceFeedTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
