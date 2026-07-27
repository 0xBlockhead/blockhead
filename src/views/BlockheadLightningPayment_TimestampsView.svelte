<!-- Generated from APP.ts. Do not edit by hand. -->

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
		<EntityView
			entityType={EntityType.BlockheadLightningPayment_Timestamp}
			entitySelector={blockheadLightningPaymentTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadLightningPaymentTimestampSelector.timestampMs) || 'Lightning payment timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(blockheadLightningPaymentTimestamp.status ?? ''), String(blockheadLightningPaymentTimestamp.feeMsat ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
