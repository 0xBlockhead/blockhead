<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		id = 'GlobalXNetworks-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalXNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalXNetwork}
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
	{#snippet Item({ item: globalXNetwork })}
		{@const globalXNetworkSelector = globalXNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalXNetwork}
			entitySelector={globalXNetworkSelector}
		>
			{#snippet Title()}
				global X network
			{/snippet}

			{#snippet Value()}
				{globalXNetworkSelector.scope}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
