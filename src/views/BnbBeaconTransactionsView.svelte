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
	}: EntityListViewProps<EntityType.BnbBeaconTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbBeaconTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				txType: true,
				tokenSymbol: true,
				$block: true,
			},
		})
	}
>
	{#snippet Item({ item: bnbBeaconTransaction })}
		{@const bnbBeaconTransactionSelector = bnbBeaconTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbBeaconTransaction}
			entitySelector={bnbBeaconTransactionSelector}
		>
			{#snippet Title()}
				{bnbBeaconTransactionSelector.txHash || 'bnb beacon transaction'}
			{/snippet}

			{#snippet Value()}
				{[(bnbBeaconTransaction.txType ?? ''), (bnbBeaconTransaction.tokenSymbol ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbBeaconTransaction.$block == null ? '' : String(bnbBeaconTransaction.$block.height) || bnbBeaconTransaction.$block.hash || 'bnb beacon block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
