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
	}: EntityListViewProps<EntityType.GitTag> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitTag}
	bind:open
	resource={
		selection({
			fields: {
				tagName: true,
				objectId: true,
				targetKind: true,
			},
		})
	}
>
	{#snippet Item({ item: gitTag })}
		{@const gitTagSelector = gitTag[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitTag}
			entitySelector={gitTagSelector}
		>
			{#snippet Title()}
				{[(gitTag.tagName ?? ''), gitTagSelector.objectId].filter(Boolean).join(' ') || 'Git tag'}
			{/snippet}

			{#snippet Value()}
				{gitTag.targetKind ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
