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
		title = 'Blockhead Kaspa node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadKaspaNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadKaspaNodeState>
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
	import BlockheadKaspaNodeStateView from '$/views/BlockheadKaspaNodeStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadKaspaNodeState}
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
				networkId: true,
			},
		})
	}
	getResourceItems={(blockheadKaspaNodeStates) => [...new Map(blockheadKaspaNodeStates.values.map((blockheadKaspaNodeState) => [blockheadKaspaNodeState[EntityMetaKey.SelectorKey], blockheadKaspaNodeState])).values()]}
	getKey={(blockheadKaspaNodeState) => blockheadKaspaNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead kaspa node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadKaspaNodeState })}
		{@const blockheadKaspaNodeStateFields = { ...blockheadKaspaNodeState[EntityMetaKey.Selector], ...blockheadKaspaNodeState }}
		{@const selection = select(EntityType.BlockheadKaspaNodeState, blockheadKaspaNodeState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadKaspaNodeStateView
			selection={selection}
			prefetched={blockheadKaspaNodeStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
