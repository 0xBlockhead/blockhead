<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'Sources',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSources-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadSource>
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
	entityType={EntityType.BlockheadSource}
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
				label: true,
				source: true,
				id: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadSources) => [...new Map(blockheadSources.values.map((blockheadSource) => [blockheadSource[EntityMetaKey.SelectorKey], blockheadSource])).values()]}
	getKey={(blockheadSource) => blockheadSource[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Sources yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSource })}
		{@const blockheadSourceFields = { ...blockheadSource[EntityMetaKey.Selector], ...blockheadSource }}
		<EntityView
			entityType={EntityType.BlockheadSource}
			entitySelector={blockheadSource[EntityMetaKey.Selector]}
			href={
				(
					blockheadSource[EntityMetaKey.Selector] != null && 'id' in blockheadSource[EntityMetaKey.Selector]
					&& blockheadSource[EntityMetaKey.Selector].id != null ?
						resolve('/~/manage/source/[sourceId=stringSegment]', {
					sourceId: String(blockheadSource[EntityMetaKey.Selector].id ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadSourceFields.label) ?? '')].filter(Boolean).join(' ') || [String((blockheadSourceFields.id) ?? '')].filter(Boolean).join(' ') || 'source'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadSourceFields.source) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
