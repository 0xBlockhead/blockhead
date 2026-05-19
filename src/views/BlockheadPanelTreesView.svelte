<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Panel layouts',
		open = $bindable(true),
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BlockheadPanelTree>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const globalEntity = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		(
			open ?
				{
					$: [Source.Local_Internal],
					$$blockheadPanelTrees: {},
				}
			:
				{
					$: [Source.Local_Internal],
				}
		),
	)

	const panelTrees = derive(
		globalEntity,
		(globalRow) => (
			globalRow['$$blockheadPanelTrees'] ?? []
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BlockheadPanelTree}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => row[EntityMetaKey.Id].id}
	{title}
	bind:open
	resource={panelTrees}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
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

	{#snippet Item({ item: row })}
		{#if row}
			<BlockheadPanelTreeView
				entityId={row[EntityMetaKey.Id]}
				href={resolve(`/dashboard/${row[EntityMetaKey.Id].id}`)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
