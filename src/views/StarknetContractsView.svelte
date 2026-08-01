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
	}: EntityListViewProps<EntityType.StarknetContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetContract}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetContract })}
		{@const starknetContractSelector = starknetContract[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetContract}
			entitySelector={starknetContractSelector}
		>
			{#snippet Title()}
				{starknetContractSelector.address || 'starknet contract'}
			{/snippet}

			{#snippet Value()}
				{starknetContract.$network.$network.name || (starknetContractSelector.$network.$network.caip2 == null ? '' : `${starknetContractSelector.$network.$network.caip2.namespace}:${starknetContractSelector.$network.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
