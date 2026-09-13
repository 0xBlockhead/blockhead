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
	}: EntityListViewProps<EntityType.SuiEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiEvent}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiEvent })}
		{@const suiEventSelector = suiEvent[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiEvent}
			entitySelector={suiEventSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/[transactionDigest=stringSegment]/event/[eventIndex=nonNegativeInteger]',
					{
						network: (
							suiEventSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(suiEventSelector.$network.$network.caip2)
							:
								suiEventSelector.$network.$network.slug
						),
						transactionDigest: suiEventSelector.transactionDigest,
						eventIndex: String(suiEventSelector.eventIndex),
					}
				)
			}
		>
			{#snippet Title()}
				Sui event
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
