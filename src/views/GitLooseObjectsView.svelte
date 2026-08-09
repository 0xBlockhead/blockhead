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
			...{
				fields: {
					objectId: true,
					byteSource: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitLooseObject })}
		{@const gitLooseObjectSelector = gitLooseObject[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitLooseObject}
			entitySelector={gitLooseObjectSelector}
			href={
				resolve(
					'/git/object/[objectId=zeroExHex]/[objectFormat=stringSegment]/(gitObject)/loose/[byteSource=stringSegment]',
					{
						objectId: gitLooseObjectSelector.objectId,
						objectFormat: gitLooseObjectSelector.objectFormat,
						byteSource: gitLooseObjectSelector.byteSource,
					}
				)
			}
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
