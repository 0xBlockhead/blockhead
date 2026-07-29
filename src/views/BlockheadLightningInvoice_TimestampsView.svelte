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
			fields: {
				timestampMs: true,
				state: true,
				amountPaidMsat: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningInvoiceTimestamp })}
		{@const blockheadLightningInvoiceTimestampSelector = blockheadLightningInvoiceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningInvoice_Timestamp}
			entitySelector={blockheadLightningInvoiceTimestampSelector}
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
