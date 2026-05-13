<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

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
		title = 'Dashboards',
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
		{
			$: [Source.Local_Internal],
			$$blockheadPanelTrees: {},
		},
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
	{#snippet Empty()}
		<p data-text="muted">
			No dashboards yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder === false}
			<BlockheadPanelTreeView
				entityId={row[EntityMetaKey.Id]}
				href={resolve(`/dashboard/${row[EntityMetaKey.Id].id}`)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
