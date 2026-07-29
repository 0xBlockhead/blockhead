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
	}: EntityListViewProps<EntityType.AptosNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosNetwork })}
		{@const aptosNetworkSelector = aptosNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosNetwork}
			entitySelector={aptosNetworkSelector}
		>
			{#snippet Title()}
				{aptosNetwork.$network.name || (aptosNetworkSelector.$network.caip2 == null ? '' : `${aptosNetworkSelector.$network.caip2.namespace}:${aptosNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
