<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.GitLooseObject> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitLooseObject}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				byteSource: true,
			},
		})
	}
>
	{#snippet Item({ item: gitLooseObject })}
		{@const gitLooseObjectSelector = gitLooseObject[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitLooseObject}
			entitySelector={gitLooseObjectSelector}
		>
			{#snippet Title()}
				{gitLooseObjectSelector.objectId || 'Git loose object'}
			{/snippet}

			{#snippet Value()}
				{gitLooseObjectSelector.byteSource}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
