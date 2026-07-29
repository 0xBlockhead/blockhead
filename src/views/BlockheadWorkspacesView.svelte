<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWorkspace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWorkspace}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				updatedAt: true,
				id: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWorkspace })}
		{@const blockheadWorkspaceSelector = blockheadWorkspace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWorkspace}
			entitySelector={blockheadWorkspaceSelector}
		>
			{#snippet Title()}
				{(blockheadWorkspace.name ?? '') || blockheadWorkspaceSelector.id || 'workspace'}
			{/snippet}

			{#snippet Value()}
				{blockheadWorkspace.updatedAt}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
