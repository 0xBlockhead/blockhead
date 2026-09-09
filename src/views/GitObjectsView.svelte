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
	}: EntityListViewProps<EntityType.GitObject> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitObject}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				objectKind: true,
				objectFormat: true,
			},
		})
	}
>
	{#snippet Item({ item: gitObject })}
		{@const gitObjectSelector = gitObject[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitObject}
			entitySelector={gitObjectSelector}
			href={
				resolve(
					'/git/object/[objectId=zeroExHex]/[objectFormat=stringSegment]',
					{
						objectId: gitObjectSelector.objectId,
						objectFormat: gitObjectSelector.objectFormat,
					}
				)
			}
		>
			{#snippet Title()}
				{gitObjectSelector.objectId || 'Git object'}
			{/snippet}

			{#snippet Value()}
				{[gitObject.objectKind, gitObjectSelector.objectFormat].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
