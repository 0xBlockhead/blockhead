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
	}: EntityListViewProps<EntityType.CardanoAddress_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoAddress_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					lovelaceBalance: true,
					blockSlot: true,
					transactionCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cardanoAddressTimestamp })}
		{@const cardanoAddressTimestampSelector = cardanoAddressTimestamp[EntityMetaKey.Selector]}
		{@const address = cardanoAddressTimestampSelector.$address}
		<EntityView
			entityType={EntityType.CardanoAddress_Timestamp}
			entitySelector={cardanoAddressTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/cardano/[address=stringSegment]/(cardanoAddress)/observation/cardano-block/[blockSlot=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in address.$network ?
								caip2StringFromValue(address.$network.caip2)
							:
								address.$network.slug
						),
						address: address.address,
						blockSlot: String(cardanoAddressTimestampSelector.blockSlot),
						source: cardanoAddressTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{String(cardanoAddressTimestamp.timestampMs ?? '') || String(cardanoAddressTimestampSelector.blockSlot) || 'Cardano address timestamp'}
			{/snippet}

			{#snippet Value()}
				{cardanoAddressTimestamp.lovelaceBalance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cardanoAddressTimestamp.transactionCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
