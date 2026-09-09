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
		title = 'ENS name searches',
		open = $bindable(true),
		id = 'BlockheadEnsNameSearches-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadEnsNameSearch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadEnsNameSearch}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				query: true,
				resultLimit: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadEnsNameSearch })}
		{@const blockheadEnsNameSearchSelector = blockheadEnsNameSearch[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadEnsNameSearch}
			entitySelector={blockheadEnsNameSearchSelector}
			href={
				resolve(
					'/~/ens/name-search/[query=stringSegment]',
					{
						query: blockheadEnsNameSearchSelector.query,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadEnsNameSearchSelector.query || 'blockhead ENS name search'}
			{/snippet}

			{#snippet Value()}
				{blockheadEnsNameSearch.resultLimit ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
