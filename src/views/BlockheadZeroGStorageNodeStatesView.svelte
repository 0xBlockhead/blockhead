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
		title = 'Blockhead 0G storage node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZeroGStorageNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZeroGStorageNodeState>
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
	import BlockheadZeroGStorageNodeStateView from '$/views/BlockheadZeroGStorageNodeStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageNodeState}
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
				nodeId: true,
				$network: true,
				connectionId: true,
			},
		})
	}
	getResourceItems={(blockheadZeroGStorageNodeStates) => [...new Map(blockheadZeroGStorageNodeStates.values.map((blockheadZeroGStorageNodeState) => [blockheadZeroGStorageNodeState[EntityMetaKey.SelectorKey], blockheadZeroGStorageNodeState])).values()]}
	getKey={(blockheadZeroGStorageNodeState) => blockheadZeroGStorageNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zero g storage node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZeroGStorageNodeState })}
		{@const blockheadZeroGStorageNodeStateFields = { ...blockheadZeroGStorageNodeState[EntityMetaKey.Selector], ...blockheadZeroGStorageNodeState }}
		{@const selection = select(EntityType.BlockheadZeroGStorageNodeState, blockheadZeroGStorageNodeState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZeroGStorageNodeStateView
			selection={selection}
			prefetched={blockheadZeroGStorageNodeStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
