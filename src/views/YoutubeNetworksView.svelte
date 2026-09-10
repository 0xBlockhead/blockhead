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
	}: EntityListViewProps<EntityType.YoutubeNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeNetwork}
	bind:open
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: youtubeNetwork })}
		<EntityView
			entityType={EntityType.YoutubeNetwork}
			entitySelector={youtubeNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/api')}
		>
			{#snippet Title()}
				{youtubeNetwork.protocolName || 'YouTube Data API'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
