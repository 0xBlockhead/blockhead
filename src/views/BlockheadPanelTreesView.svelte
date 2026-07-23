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
		title = 'Dashboards',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadPanelTrees-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadPanelTree>
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
	entityType={EntityType.BlockheadPanelTree}
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
				id: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadPanelTrees) => [...new Map(blockheadPanelTrees.values.map((blockheadPanelTree) => [blockheadPanelTree[EntityMetaKey.SelectorKey], blockheadPanelTree])).values()]}
	getKey={(blockheadPanelTree) => blockheadPanelTree[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dashboards yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadPanelTree })}
		{@const blockheadPanelTreeFields = { ...blockheadPanelTree[EntityMetaKey.Selector], ...blockheadPanelTree }}
		<EntityView
			entityType={EntityType.BlockheadPanelTree}
			entitySelector={blockheadPanelTree[EntityMetaKey.Selector]}
			href={
				(
					blockheadPanelTree[EntityMetaKey.Selector] != null && 'id' in blockheadPanelTree[EntityMetaKey.Selector]
					&& blockheadPanelTree[EntityMetaKey.Selector].id != null ?
						resolve('/~/dashboard/[dashboardId=stringSegment]', {
					dashboardId: String(blockheadPanelTree[EntityMetaKey.Selector].id ?? ''),
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
				{[String((blockheadPanelTreeFields.id) ?? '')].filter(Boolean).join(' ') || 'dashboard'}
			{/snippet}

			{#snippet Value()}
				{['Dashboard'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
