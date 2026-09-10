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
		<EntityView
			entityType={EntityType.StarknetNetwork}
			entitySelector={starknetNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{starknetNetwork.$network.name || (starknetNetwork.$network.caip2 == null ? '' : `${starknetNetwork.$network.caip2.namespace}:${starknetNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{starknetNetwork.chainId ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
