<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadPanelTree> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadPanelTree}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadPanelTree })}
		{@const blockheadPanelTreeSelector = blockheadPanelTree[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadPanelTree}
			entitySelector={blockheadPanelTreeSelector}
			href={
				resolve(
					'/~/dashboard/[dashboardId=stringSegment]',
					{
						dashboardId: blockheadPanelTreeSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadPanelTreeSelector.id || 'dashboard'}
			{/snippet}

			{#snippet Value()}
				Dashboard
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
