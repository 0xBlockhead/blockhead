<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BnbBeaconTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTokenTransfer}
	bind:open
	resource={
		selection({
			fields: {
				symbol: true,
				amount: true,
				$transaction: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTokenTransfer })}
		{@const bnbBeaconTokenTransferSelector = bnbBeaconTokenTransfer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconTokenTransfer}
			entitySelector={bnbBeaconTokenTransferSelector}
		>
			{#snippet Title()}
				{bnbBeaconTokenTransfer.symbol || 'bnb beacon token transfer'}
			{/snippet}

			{#snippet Value()}
				{bnbBeaconTokenTransfer.amount}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTokenTransferSelector.$transaction.txHash || 'bnb beacon transaction'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
