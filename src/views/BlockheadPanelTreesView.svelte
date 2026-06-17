<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		entityFieldReference,
		title = 'Panel layouts',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BlockheadPanelTree>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { proxy } from '$/routes/+layout.svelte'


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadPanelTree}
	{title}
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
			<ResourceBoundary resource={proxy(
					EntityType._Global,
					entityFieldReference.selector,
					{
						sources: [Source.Local_Internal],
					}
				).field('$$blockheadPanelTrees', {
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
								selector={item.entitySelector}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
