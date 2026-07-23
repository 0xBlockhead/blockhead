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
		title = 'Blockhead Codex stored data',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStoredDataEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCodexStoredData>
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
	entityType={EntityType.BlockheadCodexStoredData}
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
				cid: true,
				$nodeState: {
					fields: {
						endpoint: true,
					},
				},
				firstSeenAt: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCodexStoredDataEntries) => [...new Map(blockheadCodexStoredDataEntries.values.map((blockheadCodexStoredData) => [blockheadCodexStoredData[EntityMetaKey.SelectorKey], blockheadCodexStoredData])).values()]}
	getKey={(blockheadCodexStoredData) => blockheadCodexStoredData[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead codex stored data entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCodexStoredData })}
		{@const blockheadCodexStoredDataFields = { ...blockheadCodexStoredData[EntityMetaKey.Selector], ...blockheadCodexStoredData }}
		<EntityView
			entityType={EntityType.BlockheadCodexStoredData}
			entitySelector={blockheadCodexStoredData[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCodexStoredDataFields.cid) ?? '')].filter(Boolean).join(' ') || 'blockhead codex stored data'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadCodexStoredDataFields.$nodeState.peerId) ?? '')].filter(Boolean).join(' ') || 'blockhead codex storage node state'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadCodexStoredDataFields.firstSeenAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
