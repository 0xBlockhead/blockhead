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
	}: EntityListViewProps<EntityType.BlockheadLightningPayment_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningPayment_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				feeMsat: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningPaymentTimestamp })}
		{@const blockheadLightningPaymentTimestampSelector = blockheadLightningPaymentTimestamp[EntityMetaKey.Selector]}
		{@const payment = blockheadLightningPaymentTimestampSelector.$payment}
		<EntityView
			entityType={EntityType.BlockheadLightningPayment_Timestamp}
			entitySelector={blockheadLightningPaymentTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]/(blockheadLightningPayment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in payment.$network ?
								caip2StringFromValue(payment.$network.caip2)
							:
								payment.$network.slug
						),
						paymentHash: payment.paymentHash,
						timestampMs: String(blockheadLightningPaymentTimestampSelector.timestampMs),
						source: blockheadLightningPaymentTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningPaymentTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(blockheadLightningPaymentTimestamp.status ?? ''), String(blockheadLightningPaymentTimestamp.feeMsat ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
