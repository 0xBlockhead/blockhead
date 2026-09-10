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
		id = 'MediaList-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Media> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Media}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				url: true,
			},
		})
	}
>
	{#snippet Item({ item: media })}
		{@const mediaSelector = media[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Media}
			entitySelector={mediaSelector}
			href={
				resolve(
					'/(explore)/media/[url=absoluteUrl]',
					{
						url: encodeURIComponent(mediaSelector.url),
					}
				)
			}
		>
			{#snippet Title()}
				{mediaSelector.url || 'Media'}
			{/snippet}

			{#snippet Value()}
				{mediaSelector.url}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
