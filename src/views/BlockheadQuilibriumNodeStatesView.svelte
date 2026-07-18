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
		title = 'Blockhead Quilibrium node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadQuilibriumNodeState>
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
	import BlockheadQuilibriumNodeStateView from '$/views/BlockheadQuilibriumNodeStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumNodeState}
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
				connectionId: true,
				$network: true,
				endpoint: true,
			},
		})
	}
	getResourceItems={(blockheadQuilibriumNodeStates) => [...new Map(blockheadQuilibriumNodeStates.values.map((blockheadQuilibriumNodeState) => [blockheadQuilibriumNodeState[EntityMetaKey.SelectorKey], blockheadQuilibriumNodeState])).values()]}
	getKey={(blockheadQuilibriumNodeState) => blockheadQuilibriumNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumNodeState })}
		{@const blockheadQuilibriumNodeStateFields = { ...blockheadQuilibriumNodeState[EntityMetaKey.Selector], ...blockheadQuilibriumNodeState }}
		{@const selection = select(EntityType.BlockheadQuilibriumNodeState, blockheadQuilibriumNodeState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadQuilibriumNodeStateView
			selection={selection}
			prefetched={blockheadQuilibriumNodeStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
