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
	}: EntityListViewProps<EntityType.GitPackedObject> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitPackedObject}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				storedKind: true,
				$packfile: {
					fields: {
						objectFormat: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: gitPackedObject })}
		{@const gitPackedObjectSelector = gitPackedObject[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitPackedObject}
			entitySelector={gitPackedObjectSelector}
		>
			{#snippet Title()}
				{gitPackedObjectSelector.objectId || 'Git packed object'}
			{/snippet}

			{#snippet Value()}
				{gitPackedObject.storedKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitPackedObject.$packfile.packHash || 'Git packfile'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
