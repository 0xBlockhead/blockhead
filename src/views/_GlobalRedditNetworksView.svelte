<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'GlobalRedditNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalRedditNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalRedditNetwork}
	{id}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Reddit_PublicJson,
			],
		})
	}
>
	{#snippet Item({ item: globalRedditNetwork })}
		<EntityView
			entityType={EntityType._GlobalRedditNetwork}
			entitySelector={globalRedditNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(reddit)/reddit')}
		/>
	{/snippet}
</EntitiesList>
