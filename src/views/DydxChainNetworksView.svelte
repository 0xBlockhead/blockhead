<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain networks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainNetwork}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainNetwork })}
		<EntityView
			entityType={EntityType.DydxChainNetwork}
			entitySelector={dydxChainNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{dydxChainNetwork.$network.name || (dydxChainNetwork.$network.caip2 == null ? '' : `${dydxChainNetwork.$network.caip2.namespace}:${dydxChainNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
