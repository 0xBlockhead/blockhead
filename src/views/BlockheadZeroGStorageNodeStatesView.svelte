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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadZeroGStorageNodeState>
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
				$network: {
					fields: {
						name: true,
						environment: true,
					},
				},
				connectionId: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageNodeState}
			entitySelector={blockheadZeroGStorageNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadZeroGStorageNodeStateFields.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g storage node state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadZeroGStorageNodeStateFields.$network.name) ?? '')].filter(Boolean).join(' ') || 'zero g network'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadZeroGStorageNodeStateFields.connectionId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
