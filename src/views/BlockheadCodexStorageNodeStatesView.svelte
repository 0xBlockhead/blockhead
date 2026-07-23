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
		title = 'Blockhead Codex storage node states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStorageNodeStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCodexStorageNodeState>
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
	entityType={EntityType.BlockheadCodexStorageNodeState}
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
				peerId: true,
				connectionId: true,
				endpoint: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCodexStorageNodeStates) => [...new Map(blockheadCodexStorageNodeStates.values.map((blockheadCodexStorageNodeState) => [blockheadCodexStorageNodeState[EntityMetaKey.SelectorKey], blockheadCodexStorageNodeState])).values()]}
	getKey={(blockheadCodexStorageNodeState) => blockheadCodexStorageNodeState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead codex storage node states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCodexStorageNodeState })}
		{@const blockheadCodexStorageNodeStateFields = { ...blockheadCodexStorageNodeState[EntityMetaKey.Selector], ...blockheadCodexStorageNodeState }}
		<EntityView
			entityType={EntityType.BlockheadCodexStorageNodeState}
			entitySelector={blockheadCodexStorageNodeState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCodexStorageNodeStateFields.peerId) ?? '')].filter(Boolean).join(' ') || 'blockhead codex storage node state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCodexStorageNodeStateFields.connectionId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadCodexStorageNodeStateFields.endpoint) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
