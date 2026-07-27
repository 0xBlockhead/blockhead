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
	}: EntityListViewProps<EntityType.StellarNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
				passphrase: true,
			},
		})
	}
>
	{#snippet Item({ item: stellarNetwork })}
		{@const stellarNetworkSelector = stellarNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarNetwork}
			entitySelector={stellarNetworkSelector}
		>
			{#snippet Title()}
				{(stellarNetwork.$network.name || (stellarNetworkSelector.$network.caip2 == null ? '' : `${stellarNetworkSelector.$network.caip2.namespace}:${stellarNetworkSelector.$network.caip2.reference}`) || 'Network')}
			{/snippet}

			{#snippet Value()}
				{(stellarNetwork.passphrase ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
