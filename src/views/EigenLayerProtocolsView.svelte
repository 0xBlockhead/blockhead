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
	}: EntityListViewProps<EntityType.EigenLayerProtocol> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerProtocol}
	bind:open
	resource={
		selection({
			fields: {
				protocolName: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerProtocol })}
		{@const eigenLayerProtocolSelector = eigenLayerProtocol[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EigenLayerProtocol}
			entitySelector={eigenLayerProtocolSelector}
		>
			{#snippet Title()}
				{eigenLayerProtocol.protocolName || 'eigen layer protocol'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerProtocol.$network.name || (eigenLayerProtocolSelector.$network.caip2 == null ? '' : `${eigenLayerProtocolSelector.$network.caip2.namespace}:${eigenLayerProtocolSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
