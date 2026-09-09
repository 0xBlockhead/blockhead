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
	}: EntityListViewProps<EntityType.StarknetEvent> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetEvent}
	bind:open
	resource={
		selection({
			fields: {
				eventIndex: true,
				$transaction: true,
				$fromContract: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetEvent })}
		{@const starknetEventSelector = starknetEvent[EntityMetaKey.Selector]}
		{@const transaction = starknetEventSelector.$transaction}
		<EntityView
			entityType={EntityType.StarknetEvent}
			entitySelector={starknetEventSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]/(starknetTransaction)/event/[eventIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						transactionHash: transaction.transactionHash,
						eventIndex: String(starknetEventSelector.eventIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{starknetEventSelector.eventIndex}
			{/snippet}

			{#snippet Value()}
				{starknetEventSelector.$transaction.transactionHash || 'starknet transaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetEvent.$fromContract == null ? '' : starknetEvent.$fromContract.address || 'starknet contract'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
