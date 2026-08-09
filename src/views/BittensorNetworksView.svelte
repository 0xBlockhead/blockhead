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
	}: EntityListViewProps<EntityType.BittensorNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bittensorNetwork })}
		<EntityView
			entityType={EntityType.BittensorNetwork}
			entitySelector={bittensorNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bittensorNetwork.$network.name || `${bittensorNetwork.$network.caip2.namespace}:${bittensorNetwork.$network.caip2.reference}` || 'Network'}
			{/snippet}

			{#snippet Value()}
				Bittensor
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
