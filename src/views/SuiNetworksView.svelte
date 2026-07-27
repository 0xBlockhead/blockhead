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
	}: EntityListViewProps<EntityType.SuiNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: suiNetwork })}
		{@const suiNetworkSelector = suiNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiNetwork}
			entitySelector={suiNetworkSelector}
		>
			{#snippet Title()}
				{(suiNetwork.$network.name || (suiNetworkSelector.$network.caip2 == null ? '' : `${suiNetworkSelector.$network.caip2.namespace}:${suiNetworkSelector.$network.caip2.reference}`) || 'Network')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
