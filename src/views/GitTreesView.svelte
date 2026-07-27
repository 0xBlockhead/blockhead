<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitTree> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitTree}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				objectFormat: true,
			},
		})
	}
>
	{#snippet Item({ item: gitTree })}
		{@const gitTreeSelector = gitTree[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitTree}
			entitySelector={gitTreeSelector}
		>
			{#snippet Title()}
				{String(gitTreeSelector.objectId) || 'Git tree'}
			{/snippet}

			{#snippet Value()}
				{gitTreeSelector.objectFormat}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
