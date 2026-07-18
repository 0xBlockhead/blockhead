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
		title = 'Blockhead intent order observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadIntentOrder_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadIntentOrder_Timestamp>
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
	import BlockheadIntentOrder_TimestampView from '$/views/BlockheadIntentOrder_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentOrder_Timestamp}
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
				status: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadIntentOrderTimestamps) => [...new Map(blockheadIntentOrderTimestamps.values.map((blockheadIntentOrderTimestamp) => [blockheadIntentOrderTimestamp[EntityMetaKey.SelectorKey], blockheadIntentOrderTimestamp])).values()]}
	getKey={(blockheadIntentOrderTimestamp) => blockheadIntentOrderTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead intent order observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadIntentOrderTimestamp })}
		{@const blockheadIntentOrderTimestampFields = { ...blockheadIntentOrderTimestamp[EntityMetaKey.Selector], ...blockheadIntentOrderTimestamp }}
		{@const selection = select(EntityType.BlockheadIntentOrder_Timestamp, blockheadIntentOrderTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadIntentOrder_TimestampView
			selection={selection}
			prefetched={blockheadIntentOrderTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
