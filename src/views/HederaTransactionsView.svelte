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
	}: EntityListViewProps<EntityType.HederaTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTransaction}
	bind:open
	resource={
		selection({
			fields: {
				transactionType: true,
				result: true,
				transactionId: true,
				consensusTimestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaTransaction })}
		<EntityView
			entityType={EntityType.HederaTransaction}
			entitySelector={hederaTransaction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{hederaTransaction.transactionType || hederaTransaction.transactionId || 'hedera transaction'}
			{/snippet}

			{#snippet Value()}
				{hederaTransaction.result ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaTransaction.consensusTimestamp}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
