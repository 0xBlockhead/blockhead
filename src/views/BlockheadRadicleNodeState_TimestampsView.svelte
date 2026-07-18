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
		title = 'Blockhead Radicle node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadRadicleNodeState_Timestamp>
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
	import BlockheadRadicleNodeState_TimestampView from '$/views/BlockheadRadicleNodeState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
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
				timestampMs: true,
				alias: true,
				nodeVersion: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadRadicleNodeStateTimestamps) => [...new Map(blockheadRadicleNodeStateTimestamps.values.map((blockheadRadicleNodeStateTimestamp) => [blockheadRadicleNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleNodeStateTimestamp])).values()]}
	getKey={(blockheadRadicleNodeStateTimestamp) => blockheadRadicleNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead radicle node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRadicleNodeStateTimestamp })}
		{@const blockheadRadicleNodeStateTimestampFields = { ...blockheadRadicleNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadRadicleNodeStateTimestamp }}
		{@const selection = select(EntityType.BlockheadRadicleNodeState_Timestamp, blockheadRadicleNodeStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadRadicleNodeState_TimestampView
			selection={selection}
			prefetched={blockheadRadicleNodeStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
