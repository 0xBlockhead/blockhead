<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StarknetNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
				chainId: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetNetwork })}
		{@const starknetNetworkSelector = starknetNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetNetwork}
			entitySelector={starknetNetworkSelector}
		>
			{#snippet Title()}
				{starknetNetwork.$network.name || (starknetNetworkSelector.$network.caip2 == null ? '' : `${starknetNetworkSelector.$network.caip2.namespace}:${starknetNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{starknetNetwork.chainId ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
