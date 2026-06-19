<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Panel layouts',
		id = 'blockhead-panel-trees',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadPanelTree>
			title?: string
			id?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { select } from '$/routes/+layout.svelte'


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadPanelTree}
	{title}
	{id}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Nested split-pane layouts serialize as trees: child region ids and width ratios so multi-column dashboards reopen with the same proportions.
		</p>
		<p>
			Geometry blobs do not embed chat transcripts, market tape, or canonical chain heads—each concern has its own persistence model.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No saved layouts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={select(
					EntityType._Global,
					selection.entitySelector,
					{
						sources: [Source.Local_Internal],
					}
				).$$blockheadPanelTrees({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading panel layouts…">
				{#snippet children(panelTrees)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadPanelTree}
						id={`${id}-items`}
						open={true}
						items={panelTrees.entities}
						getKey={(panelTree) => stringify(panelTree.entitySelector)}
						getSortValue={(panelTree) => panelTree.entitySelector.id}
						placeholderText="Loading panel layouts…"
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No saved layouts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadPanelTreeView
								selection={select(EntityType.BlockheadPanelTree, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
