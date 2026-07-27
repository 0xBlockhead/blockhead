<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Transactions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosTransaction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
				code: true,
				gasUsed: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosTransaction })}
		{@const cosmosTransactionSelector = cosmosTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CosmosTransaction}
			entitySelector={cosmosTransactionSelector}
		>
			{#snippet Title()}
				{cosmosTransactionSelector.txHash || 'Cosmos transaction'}
			{/snippet}

			{#snippet Value()}
				{cosmosTransactionSelector.txHash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(cosmosTransaction.code ?? ''), String(cosmosTransaction.gasUsed ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
