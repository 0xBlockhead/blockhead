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
	}: EntityListViewProps<EntityType.RedditNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditNetwork}
	bind:open
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: redditNetwork })}
		<EntityView
			entityType={EntityType.RedditNetwork}
			entitySelector={redditNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(reddit)/reddit/(globalRedditNetwork)/network')}
		>
			{#snippet Title()}
				{redditNetwork.protocolName || 'Reddit network'}
			{/snippet}

			{#snippet Value()}
				Reddit
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
