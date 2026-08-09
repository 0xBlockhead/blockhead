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
	}: EntityListViewProps<EntityType.Url> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Url}
	bind:open
	resource={
		selection({
			...{
				fields: {
					url: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: url })}
		{@const urlSelector = url[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Url}
			entitySelector={urlSelector}
			href={
				resolve(
					'/(explore)/url/[url=absoluteUrl]',
					{
						url: encodeURIComponent(urlSelector.url),
					}
				)
			}
		>
			{#snippet Title()}
				{urlSelector.url || 'URL'}
			{/snippet}

			{#snippet Value()}
				{urlSelector.url}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
