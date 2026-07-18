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
		title = 'Hyperliquid order observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HyperliquidOrder_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.HyperliquidOrder_Timestamp>
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
	import HyperliquidOrder_TimestampView from '$/views/HyperliquidOrder_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidOrder_Timestamp}
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
	getResourceItems={(hyperliquidOrderTimestamps) => [...new Map(hyperliquidOrderTimestamps.values.map((hyperliquidOrderTimestamp) => [hyperliquidOrderTimestamp[EntityMetaKey.SelectorKey], hyperliquidOrderTimestamp])).values()]}
	getKey={(hyperliquidOrderTimestamp) => hyperliquidOrderTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hyperliquid order observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hyperliquidOrderTimestamp })}
		{@const hyperliquidOrderTimestampFields = { ...hyperliquidOrderTimestamp[EntityMetaKey.Selector], ...hyperliquidOrderTimestamp }}
		{@const selection = select(EntityType.HyperliquidOrder_Timestamp, hyperliquidOrderTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<HyperliquidOrder_TimestampView
			selection={selection}
			prefetched={hyperliquidOrderTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
