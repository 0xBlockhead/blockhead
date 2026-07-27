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
	}: EntityListViewProps<EntityType.BnbBeaconNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
				decommissionedAtMs: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconNetwork })}
		{@const bnbBeaconNetworkSelector = bnbBeaconNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconNetwork}
			entitySelector={bnbBeaconNetworkSelector}
		>
			{#snippet Title()}
				{(bnbBeaconNetwork.$network.name || (bnbBeaconNetworkSelector.$network.caip2 == null ? '' : `${bnbBeaconNetworkSelector.$network.caip2.namespace}:${bnbBeaconNetworkSelector.$network.caip2.reference}`) || 'Network')}
			{/snippet}

			{#snippet Value()}
				{String(bnbBeaconNetwork.decommissionedAtMs ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
