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
		id = 'GlobalNostrNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalNostrNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalNostrNetwork}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalNostrNetwork })}
		<EntityView
			entityType={EntityType._GlobalNostrNetwork}
			entitySelector={globalNostrNetwork[EntityMetaKey.Selector]}
			href={resolve('/(social)/(nostr)/nostr')}
		/>
	{/snippet}
</EntitiesList>
