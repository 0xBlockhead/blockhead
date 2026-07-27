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
	}: EntityListViewProps<EntityType.BlockheadLightningInvoice> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningInvoice}
	bind:open
	resource={
		selection({
			fields: {
				memo: true,
				valueMsat: true,
				paymentHash: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningInvoice })}
		{@const blockheadLightningInvoiceSelector = blockheadLightningInvoice[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningInvoice}
			entitySelector={blockheadLightningInvoiceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]',
					{
						network: (
							'caip2' in blockheadLightningInvoiceSelector.$network ?
								String(caip2StringFromValue(blockheadLightningInvoiceSelector.$network.caip2))
							:
								String(blockheadLightningInvoiceSelector.$network.slug)
						),
						paymentHash: String(blockheadLightningInvoiceSelector.paymentHash),
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadLightningInvoice.memo ?? '') || blockheadLightningInvoiceSelector.paymentHash || 'Lightning invoice'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadLightningInvoice.valueMsat ?? '')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
