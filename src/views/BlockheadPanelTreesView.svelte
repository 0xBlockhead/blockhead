<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadPanelTree>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					id: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadPanelTree}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadPanelTrees)}
			{@const uniqueBlockheadPanelTrees = [...new Map(blockheadPanelTrees.values.map((blockheadPanelTree) => [blockheadPanelTree[EntityMetaKey.SelectorKey], blockheadPanelTree])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadPanelTree}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadPanelTrees.totalCount}
				getKey={(blockheadPanelTree) => blockheadPanelTree[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadPanelTrees}
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
					{@const selection = select(EntityType.BlockheadPanelTree, blockheadPanelTree[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const blockheadPanelTreeHrefFields = { ...blockheadPanelTree, ...blockheadPanelTree[EntityMetaKey.Selector] }}
					<BlockheadPanelTreeView
						selection={selection}
						prefetched={blockheadPanelTreeFields}
						href={
							(blockheadPanelTreeHrefFields.id !== undefined ? resolve('/~/dashboard/[dashboardId=stringSegment]', {
								dashboardId: String(blockheadPanelTreeHrefFields.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadPanelTree}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
