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
	}: EntityListViewProps<EntityType.ArweaveNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: arweaveNetwork })}
		{@const arweaveNetworkSelector = arweaveNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ArweaveNetwork}
			entitySelector={arweaveNetworkSelector}
		>
			{#snippet Title()}
				{arweaveNetwork.$network.name || (arweaveNetworkSelector.$network.caip2 == null ? '' : `${arweaveNetworkSelector.$network.caip2.namespace}:${arweaveNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				Arweave
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
