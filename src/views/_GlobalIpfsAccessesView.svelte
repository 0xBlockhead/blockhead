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
		id = 'GlobalIpfsAccesses-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalIpfsAccess> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalIpfsAccess}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalIpfsAccess })}
		<EntityView
			entityType={EntityType._GlobalIpfsAccess}
			entitySelector={globalIpfsAccess[EntityMetaKey.Selector]}
			href={resolve('/(explore)/(ipfs)/ipfs/(ipfsProtocol)/access')}
		>
			{#snippet Title()}
				global IPFS access
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
