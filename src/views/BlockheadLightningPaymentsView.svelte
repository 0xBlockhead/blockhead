<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.BlockheadLightningPayment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningPayment}
	bind:open
	resource={
		selection({
			fields: {
				paymentHash: true,
				valueMsat: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningPayment })}
		{@const blockheadLightningPaymentSelector = blockheadLightningPayment[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningPayment}
			entitySelector={blockheadLightningPaymentSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]',
					{
						network: (
							'caip2' in blockheadLightningPaymentSelector.$network ?
								String(caip2StringFromValue(blockheadLightningPaymentSelector.$network.caip2))
							:
								String(blockheadLightningPaymentSelector.$network.slug)
						),
						paymentHash: String(blockheadLightningPaymentSelector.paymentHash),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningPaymentSelector.paymentHash || 'Lightning payment'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadLightningPayment.valueMsat ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
