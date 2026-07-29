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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TezosNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: tezosNetwork })}
		{@const tezosNetworkSelector = tezosNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosNetwork}
			entitySelector={tezosNetworkSelector}
		>
			{#snippet Title()}
				{tezosNetwork.$network.name || (tezosNetworkSelector.$network.caip2 == null ? '' : `${tezosNetworkSelector.$network.caip2.namespace}:${tezosNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
