<!-- Generated from APP.ts. Do not edit by hand. -->

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
		id = 'GlobalYoutubeNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalYoutubeNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalYoutubeNetwork}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalYoutubeNetwork })}
		<EntityView
			entityType={EntityType._GlobalYoutubeNetwork}
			entitySelector={globalYoutubeNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(youtube)/youtube')}
		>
			{#snippet Title()}
				YouTube
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
