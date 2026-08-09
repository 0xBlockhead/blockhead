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
			...{
				fields: {
					$network: true,
					decommissionedAtMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconNetwork })}
		<EntityView
			entityType={EntityType.BnbBeaconNetwork}
			entitySelector={bnbBeaconNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{bnbBeaconNetwork.$network.name || (bnbBeaconNetwork.$network.caip2 == null ? '' : `${bnbBeaconNetwork.$network.caip2.namespace}:${bnbBeaconNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconNetwork.decommissionedAtMs ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
