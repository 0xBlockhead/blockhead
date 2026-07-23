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
		title = 'Blockhead 0G stored chunks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZeroGStoredChunks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadZeroGStoredChunk>
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
	entityType={EntityType.BlockheadZeroGStoredChunk}
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
				dataRoot: true,
				chunkIndex: true,
				present: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadZeroGStoredChunks) => [...new Map(blockheadZeroGStoredChunks.values.map((blockheadZeroGStoredChunk) => [blockheadZeroGStoredChunk[EntityMetaKey.SelectorKey], blockheadZeroGStoredChunk])).values()]}
	getKey={(blockheadZeroGStoredChunk) => blockheadZeroGStoredChunk[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zero g stored chunks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZeroGStoredChunk })}
		{@const blockheadZeroGStoredChunkFields = { ...blockheadZeroGStoredChunk[EntityMetaKey.Selector], ...blockheadZeroGStoredChunk }}
		<EntityView
			entityType={EntityType.BlockheadZeroGStoredChunk}
			entitySelector={blockheadZeroGStoredChunk[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadZeroGStoredChunkFields.dataRoot) ?? '')].filter(Boolean).join(' ') || 'blockhead zero g stored chunk'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadZeroGStoredChunkFields.chunkIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadZeroGStoredChunkFields.present) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
