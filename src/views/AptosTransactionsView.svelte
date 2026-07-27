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
	}: EntityListViewProps<EntityType.AptosTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTransaction}
	bind:open
	resource={
		selection({
			fields: {
				hash: true,
				transactionKind: true,
				version: true,
				sender: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTransaction })}
		{@const aptosTransactionSelector = aptosTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosTransaction}
			entitySelector={aptosTransactionSelector}
		>
			{#snippet Title()}
				{aptosTransactionSelector.hash || String(aptosTransactionSelector.version) || 'aptos transaction'}
			{/snippet}

			{#snippet Value()}
				{(aptosTransaction.transactionKind ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(aptosTransaction.sender ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
