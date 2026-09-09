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
		id = 'GlobalArweaveNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalArweaveNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalArweaveNetwork}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				scope: true,
			},
		})
	}
>
	{#snippet Item({ item: globalArweaveNetwork })}
		{@const globalArweaveNetworkSelector = globalArweaveNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalArweaveNetwork}
			entitySelector={globalArweaveNetworkSelector}
			href={
				globalArweaveNetworkSelector.scope === 'global' ?
					resolve('/~/arweave')
				:
					undefined
			}
		>
			{#snippet Value()}
				{globalArweaveNetworkSelector.scope}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
