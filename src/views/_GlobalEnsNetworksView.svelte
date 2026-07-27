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
		id = 'GlobalEnsNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalEnsNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEnsNetwork}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalEnsNetwork })}
		<EntityView
			entityType={EntityType._GlobalEnsNetwork}
			entitySelector={globalEnsNetwork[EntityMetaKey.Selector]}
			href={resolve('/(explore)/(ens)/ens')}
		>
			{#snippet Title()}
				ENS
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
