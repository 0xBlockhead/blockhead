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
	}: EntityListViewProps<EntityType.MoneroTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				$block: true,
				feeAtomicUnits: true,
			},
		})
	}
>
	{#snippet Item({ item: moneroTransaction })}
		{@const moneroTransactionSelector = moneroTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoneroTransaction}
			entitySelector={moneroTransactionSelector}
		>
			{#snippet Title()}
				{moneroTransactionSelector.txHash || 'monero transaction'}
			{/snippet}

			{#snippet Value()}
				{moneroTransaction.$block == null ? '' : String(moneroTransaction.$block.height) || 'monero block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroTransaction.feeAtomicUnits ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
