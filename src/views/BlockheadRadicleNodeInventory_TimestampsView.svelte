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
		title = 'Blockhead Radicle node inventory observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleNodeInventory_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadRadicleNodeInventory_Timestamp>
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
	import BlockheadRadicleNodeInventory_TimestampView from '$/views/BlockheadRadicleNodeInventory_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
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
				repositoryCount: true,
			},
		})
	}
	getResourceItems={(blockheadRadicleNodeInventoryTimestamps) => [...new Map(blockheadRadicleNodeInventoryTimestamps.values.map((blockheadRadicleNodeInventoryTimestamp) => [blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleNodeInventoryTimestamp])).values()]}
	getKey={(blockheadRadicleNodeInventoryTimestamp) => blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead radicle node inventory observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRadicleNodeInventoryTimestamp })}
		{@const blockheadRadicleNodeInventoryTimestampFields = { ...blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector], ...blockheadRadicleNodeInventoryTimestamp }}
		{@const selection = select(EntityType.BlockheadRadicleNodeInventory_Timestamp, blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadRadicleNodeInventory_TimestampView
			selection={selection}
			prefetched={blockheadRadicleNodeInventoryTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
