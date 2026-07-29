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
	}: EntityListViewProps<EntityType.IcpNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: icpNetwork })}
		{@const icpNetworkSelector = icpNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IcpNetwork}
			entitySelector={icpNetworkSelector}
		>
			{#snippet Title()}
				{icpNetwork.$network.name || (icpNetworkSelector.$network.caip2 == null ? '' : `${icpNetworkSelector.$network.caip2.namespace}:${icpNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
