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
		id = 'NostrSearchQueries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NostrSearchQuery> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrSearchQuery}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					query: true,
					resultCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nostrSearchQuery })}
		{@const nostrSearchQuerySelector = nostrSearchQuery[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NostrSearchQuery}
			entitySelector={nostrSearchQuerySelector}
			href={
				resolve(
					'/(social)/(nostr)/nostr/(globalNostrNetwork)/search/[query=stringSegment]',
					{
						query: nostrSearchQuerySelector.query,
					}
				)
			}
		>
			{#snippet Title()}
				{['Search: ', nostrSearchQuerySelector.query].filter(Boolean).join(' ') || 'Nostr profile search'}
			{/snippet}

			{#snippet Value()}
				{nostrSearchQuery.resultCount}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
