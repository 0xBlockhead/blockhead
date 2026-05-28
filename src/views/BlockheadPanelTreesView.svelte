<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/$Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


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
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const global = useEntity(
				EntityType._Global,
				entityFieldReference.entityId,
				{
					$: [Source.Local_Internal],
					$$blockheadPanelTrees: {},
				},
			)}
			{@const panelTrees = derive(
				global,
				(global) => (
					global['$$blockheadPanelTrees'] ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadPanelTree}
				{title}
				open={true}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => row[EntityMetaKey.Id].id}
				resource={panelTrees}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No saved layouts yet.
					</p>
				{/snippet}

				{#snippet Item({ item: panelTree })}
					<BlockheadPanelTreeView
						entityId={panelTree[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
