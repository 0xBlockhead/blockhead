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
		id = 'GlobalSwarmAccesses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalSwarmAccess> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalSwarmAccess}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalSwarmAccess })}
		<EntityView
			entityType={EntityType._GlobalSwarmAccess}
			entitySelector={globalSwarmAccess[EntityMetaKey.Selector]}
			href={resolve('/(swarm)/swarm/(swarmProtocol)/access')}
		>
			{#snippet Value()}
				Swarm gateway access
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
