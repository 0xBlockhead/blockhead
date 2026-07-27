<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Arweave observeds',
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
	{title}
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
		>
			{#snippet Title()}
				global Arweave network
			{/snippet}

			{#snippet Value()}
				{globalArweaveNetworkSelector.scope}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
