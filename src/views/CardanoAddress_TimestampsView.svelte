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
			fields: {
				timestampMs: true,
				lovelaceBalance: true,
				blockSlot: true,
				transactionCount: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoAddressTimestamp })}
		{@const cardanoAddressTimestampSelector = cardanoAddressTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CardanoAddress_Timestamp}
			entitySelector={cardanoAddressTimestampSelector}
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
