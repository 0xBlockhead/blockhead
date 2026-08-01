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
		{@const network = blockheadLightningPaymentSelector.$network}
		<EntityView
			entityType={EntityType.BlockheadLightningPayment}
			entitySelector={blockheadLightningPaymentSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						paymentHash: blockheadLightningPaymentSelector.paymentHash,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningPaymentSelector.paymentHash || 'Lightning payment'}
			{/snippet}

			{#snippet Value()}
				{blockheadLightningPayment.valueMsat ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
