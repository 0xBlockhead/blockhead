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
		title = 'Blockhead Lightning node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLightningNodeState_Timestamp>
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
	import BlockheadLightningNodeState_TimestampView from '$/views/BlockheadLightningNodeState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
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
				syncedToChain: true,
				syncedToGraph: true,
				blockHeight: true,
			},
		})
	}
	getResourceItems={(blockheadLightningNodeStateTimestamps) => [...new Map(blockheadLightningNodeStateTimestamps.values.map((blockheadLightningNodeStateTimestamp) => [blockheadLightningNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadLightningNodeStateTimestamp])).values()]}
	getKey={(blockheadLightningNodeStateTimestamp) => blockheadLightningNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningNodeStateTimestamp })}
		{@const blockheadLightningNodeStateTimestampFields = { ...blockheadLightningNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadLightningNodeStateTimestamp }}
		{@const selection = select(EntityType.BlockheadLightningNodeState_Timestamp, blockheadLightningNodeStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLightningNodeState_TimestampView
			selection={selection}
			prefetched={blockheadLightningNodeStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
