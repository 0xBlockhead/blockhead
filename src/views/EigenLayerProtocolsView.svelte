<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
		{@const network = eigenLayerProtocolSelector.$network}
		<EntityView
			entityType={EntityType.EigenLayerProtocol}
			entitySelector={eigenLayerProtocolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/eigenlayer',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerProtocol.protocolName || 'eigen layer protocol'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerProtocol.$network.name || (eigenLayerProtocol.$network.caip2 == null ? '' : `${eigenLayerProtocol.$network.caip2.namespace}:${eigenLayerProtocol.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
