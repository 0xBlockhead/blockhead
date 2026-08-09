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
	}: EntityListViewProps<EntityType.BlockheadLightningInvoice_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningInvoice_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					state: true,
					amountPaidMsat: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningInvoiceTimestamp })}
		{@const blockheadLightningInvoiceTimestampSelector = blockheadLightningInvoiceTimestamp[EntityMetaKey.Selector]}
		{@const invoice = blockheadLightningInvoiceTimestampSelector.$invoice}
		<EntityView
			entityType={EntityType.BlockheadLightningInvoice_Timestamp}
			entitySelector={blockheadLightningInvoiceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]/(blockheadLightningInvoice)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in invoice.$network ?
								caip2StringFromValue(invoice.$network.caip2)
							:
								invoice.$network.slug
						),
						paymentHash: invoice.paymentHash,
						timestampMs: String(blockheadLightningInvoiceTimestampSelector.timestampMs),
						source: blockheadLightningInvoiceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningInvoiceTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(blockheadLightningInvoiceTimestamp.state ?? ''), String(blockheadLightningInvoiceTimestamp.amountPaidMsat ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
