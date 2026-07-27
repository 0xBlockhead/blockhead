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
	}: EntityListViewProps<EntityType.CelestiaNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CelestiaNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: celestiaNetwork })}
		{@const celestiaNetworkSelector = celestiaNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CelestiaNetwork}
			entitySelector={celestiaNetworkSelector}
		>
			{#snippet Title()}
				{(celestiaNetwork.$network.name || (celestiaNetworkSelector.$network.caip2 == null ? '' : `${celestiaNetworkSelector.$network.caip2.namespace}:${celestiaNetworkSelector.$network.caip2.reference}`) || 'Network')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
